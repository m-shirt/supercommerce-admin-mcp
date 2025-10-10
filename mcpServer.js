import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

import { discoverTools } from "./lib/tools.js";
import { discoverPrompts } from "./lib/prompts.js";
import { discoverResources, getResourceByUri } from "./lib/resources.js";

const SERVER_NAME = "supercommerce";

// Shared maps for SSE sessions
export const transports = {};
export const servers = {};

/* --------------------- HELPERS --------------------- */
export async function transformTools(tools) {
  return tools
    .map(
      (t) =>
        t.definition?.function && {
          name: t.definition.function.name,
          description: t.definition.function.description,
          inputSchema: t.definition.function.parameters,
        }
    )
    .filter(Boolean);
}

export async function transformPrompts(prompts) {
  return prompts.map((p) => ({
    id: p.id,
    name: p.metadata.title,
    description: p.metadata.description,
    arguments: p.metadata.argsSchema,
  }));
}

export async function setupServerHandlers(server, tools, prompts, resources) {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: await transformTools(tools),
  }));

  const transformedPrompts = await transformPrompts(prompts);
  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: transformedPrompts,
  }));

  // Widget resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: resources,
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    try {
      const content = getResourceByUri(request.params.uri, resources);
      return {
        contents: [content],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Resource not found: ${request.params.uri}`
      );
    }
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const tool = tools.find((t) => t.definition.function.name === toolName);
    if (!tool)
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);

    const args = request.params.arguments;
    const required = tool.definition?.function?.parameters?.required || [];
    for (const p of required)
      if (!(p in args))
        throw new McpError(
          ErrorCode.InvalidParams,
          `Missing required parameter: ${p}`
        );

    try {
      const result = await tool.function(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (e) {
      throw new McpError(ErrorCode.InternalError, `API error: ${e.message}`);
    }
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const prompt = prompts.find(
      (p) => p.metadata.title === request.params.name
    );
    if (!prompt)
      throw new McpError(ErrorCode.MethodNotFound, "Prompt not found");

    const args = request.params.arguments || {};
    const result = await prompt.handler(args);

    if (!Array.isArray(result.messages))
      throw new McpError(
        ErrorCode.InternalError,
        "Prompt handler must return messages array"
      );
    return result;
  });
}

/* --------------------- NEXT.JS API HANDLERS --------------------- */
export async function mcpHandler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const accept = (req.headers["accept"] || "").toLowerCase();
  if (
    !accept.includes("application/json") ||
    !accept.includes("text/event-stream")
  ) {
    return res.status(406).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message:
          "Client must accept both application/json and text/event-stream",
      },
      id: null,
    });
  }

  const tools = await discoverTools();
  const prompts = await discoverPrompts();
  const resources = await discoverResources();
  const server = new Server(
    { name: SERVER_NAME, version: "0.1.0" },
    { capabilities: { tools: {}, prompts: {}, resources: {} } }
  );

  await setupServerHandlers(server, tools, prompts, resources);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on("close", async () => {
    await transport.close();
    await server.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
export async function sseHandler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  const tools = await discoverTools();
  const prompts = await discoverPrompts();
  const resources = await discoverResources();
  const server = new Server(
    { name: SERVER_NAME, version: "0.1.0" },
    { capabilities: { tools: {}, prompts: {}, resources: {} } }
  );

  await setupServerHandlers(server, tools, prompts, resources);

  const transport = new SSEServerTransport("/api/messages", res);
  transports[transport.sessionId] = transport;
  servers[transport.sessionId] = server;

  res.on("close", async () => {
    delete transports[transport.sessionId];
    await server.close();
    delete servers[transport.sessionId];
  });

  await server.connect(transport);
}
export async function sseMessageHandler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  const sessionId = req.query.sessionId || req.body?.sessionId; // ✅ support both
  const transport = transports[sessionId];
  const server = servers[sessionId];

  if (!transport || !server) {
    return res.status(400).send("No transport/server found for sessionId");
  }

  try {
    await transport.handlePostMessage(req, res);
  } catch (err) {
    console.error("Error from MCP server:", err);
    res.status(500).send("Internal server error");
  }
}

/* --------------------- CLI MODE --------------------- */
export async function run() {
  const args = process.argv.slice(2);
  const tools = await discoverTools();
  const prompts = await discoverPrompts();
  const resources = await discoverResources();

  if (args.includes("--streamable-http")) {
    const { default: express } = await import("express");
    const expressApp = express();
    expressApp.use(express.json());
    expressApp.post("/mcp", async (req, res) => {
      const server = new Server(
        { name: SERVER_NAME, version: "0.1.0" },
        { capabilities: { tools: {}, prompts: {}, resources: {} } }
      );
      await setupServerHandlers(server, tools, prompts, resources);
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });
      res.on("close", async () => {
        await transport.close();
        await server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    });
    const port = process.env.PORT || 3001;
    expressApp.listen(port, () =>
      console.log(`Streamable HTTP running on port ${port}`)
    );
  } else if (args.includes("--sse")) {
    const expressApp = require("express")();
    const localTransports = {};
    const localServers = {};
    expressApp.get("/sse", async (req, res) => {
      const server = new Server(
        { name: SERVER_NAME, version: "0.1.0" },
        { capabilities: { tools: {}, prompts: {}, resources: {} } }
      );
      await setupServerHandlers(server, tools, prompts, resources);
      const transport = new SSEServerTransport("/messages", res);
      localTransports[transport.sessionId] = transport;
      localServers[transport.sessionId] = server;
      res.on("close", async () => {
        delete localTransports[transport.sessionId];
        await server.close();
        delete localServers[transport.sessionId];
      });
      await server.connect(transport);
    });
    expressApp.post("/messages", async (req, res) => {
      const sessionId = req.query.sessionId;
      const transport = localTransports[sessionId];
      const server = localServers[sessionId];
      if (transport && server) await transport.handlePostMessage(req, res);
      else res.status(400).send("No transport/server found for sessionId");
    });
    const port = process.env.PORT || 3001;
    expressApp.listen(port, () =>
      console.log(`SSE server running on port ${port}`)
    );
  } else {
    const server = new Server(
      { name: SERVER_NAME, version: "0.1.0" },
      { capabilities: { tools: {}, prompts: {}, resources: {} } }
    );
    await setupServerHandlers(server, tools, prompts, resources);
    process.on("SIGINT", async () => {
      await server.close();
      process.exit(0);
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
    //console.log(`[Stdio Server] is running`);
  }
}
run().catch(console.error);
