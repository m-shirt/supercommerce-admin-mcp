// /pages/home/Home.js
import { useState } from "react";
import HomeView from "./HomeView";

export default function Home() {
  const [tools, setTools] = useState([]);
  const [selected, setSelected] = useState(null);
  const [paramsText, setParamsText] = useState("{}");
  const [paramsForm, setParamsForm] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState("form");
  const [parsedResponse, setParsedResponse] = useState(null);

  const [serverUrl, setServerUrl] = useState(
    typeof window !== "undefined" ? `${window.location.origin}/api/mcp` : ""
  );
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [serverInput, setServerInput] = useState(serverUrl);

  function isCrossOrigin(url) {
    try {
      const target = new URL(url, window.location.origin);
      return target.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  async function rpcRequest(baseUrl, method, params = {}) {
    let targetUrl = baseUrl;
    if (typeof window !== "undefined" && isCrossOrigin(baseUrl)) {
      targetUrl = `/api/proxy?url=${encodeURIComponent(baseUrl)}`;
    }

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Accept: "application/json, text/event-stream",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now().toString(),
        method,
        params,
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const match = text.match(/data:\s*(\{.*\})/);
    if (!match) throw new Error("No JSON payload in SSE response");
    const json = JSON.parse(match[1]);
    if (json.error) throw new Error(json.error.message || "Unknown RPC error");
    return json.result;
  }

  async function loadTools(url) {
    setLogs((l) => [...l, `🔍 Loading tools from ${url}...`]);
    try {
      const result = await rpcRequest(url, "tools/list", {});
      setTools(result.tools || []);
      setLogs((l) => [...l, `✅ Tools fetched: ${result.tools?.length || 0}`]);
      return true;
    } catch (e) {
      setErr("Failed to load tools");
      setLogs((l) => [...l, `❌ Error loading tools: ${String(e)}`]);
      return false;
    }
  }

  function selectTool(tool) {
    setSelected(tool);
    const example = tool?.inputSchema?.properties
      ? Object.fromEntries(
          Object.entries(tool.inputSchema.properties).map(([k, v]) => {
            let defaultVal = "";
            if (v.type === "number") defaultVal = 0;
            else if (v.type === "boolean") defaultVal = false;
            return [k, defaultVal];
          })
        )
      : {};
    setParamsText(JSON.stringify(example, null, 2));
    setParamsForm(example);
    setResponse(null);
    setErr("");
    setParsedResponse(null);
  }

  function safeJsonParse(response) {
    if (response?.content?.length) {
      try {
        setParsedResponse(JSON.parse(response.content[0].text));
      } catch (error) {
        setParsedResponse({ error: "Failed to parse JSON", raw: response.content[0].text });
      }
    }
  }

  async function runTool() {
    setLoading(true);
    setErr("");
    setResponse(null);
    setParsedResponse(null);
    try {
      const args = mode === "json" ? JSON.parse(paramsText) : paramsForm;
      const result = await rpcRequest(serverUrl, "tools/call", {
        name: selected.name,
        arguments: args,
        _meta: { progressToken: 20 },
      });
      setResponse(result);
      safeJsonParse(result);
      setLogs((l) => [...l, `Tool "${selected.name}" executed successfully`]);
    } catch (e) {
      setErr(String(e.message || e));
      setLogs((l) => [...l, `Error running tool: ${String(e)}`]);
    } finally {
      setLoading(false);
    }
  }

  async function connect() {
    setErr("");
    setLogs((l) => [...l, `Connecting to ${serverInput}...`]);
    setTools([]);
    setSelected(null);
    setServerUrl(serverInput);
    const ok = await loadTools(serverInput);
    if (ok) {
      setConnected(true);
      setLogs((l) => [...l, `Connected successfully to ${serverInput}`]);
    } else {
      setConnected(false);
      setErr(`Failed to connect to ${serverInput}`);
      setLogs((l) => [...l, `Failed to connect to ${serverInput}`]);
    }
  }

  function disconnect() {
    setConnected(false);
    setTools([]);
    setSelected(null);
    setLogs((l) => [...l, "Disconnected"]);
  }

  function reconnect() {
    disconnect();
    connect();
  }

  return (
    <HomeView
      tools={tools}
      selected={selected}
      selectTool={selectTool}
      paramsText={paramsText}
      setParamsText={setParamsText}
      paramsForm={paramsForm}
      setParamsForm={setParamsForm}
      mode={mode}
      setMode={setMode}
      runTool={runTool}
      loading={loading}
      err={err}
      parsedResponse={parsedResponse}
      connected={connected}
      connect={connect}
      disconnect={disconnect}
      reconnect={reconnect}
      serverInput={serverInput}
      setServerInput={setServerInput}
      logs={logs}
    />
  );
}
