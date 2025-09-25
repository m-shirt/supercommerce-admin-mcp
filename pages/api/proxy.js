// pages/api/proxy.js

export const config = {
  api: {
    bodyParser: false, // ⬅️ prevent Next.js from messing with the body
  },
};

export default async function handler(req, res) {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      res.status(400).json({ error: "Missing target URL" });
      return;
    }

    // Build headers (skip host & content-length since body may differ)
    const headers = { ...req.headers };
    delete headers.host;
    delete headers["content-length"];

    // Forward request
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
      duplex: "half", // ⬅️ required for streaming body in Node 18+
    });

    // Copy status
    res.status(response.status);

    // Copy headers (avoid forbidden ones)
    response.headers.forEach((value, key) => {
      if (!["content-encoding", "content-length"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    // Pipe the response back to the client
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy error:", err);
    res
      .status(500)
      .json({ error: "Proxy request failed", details: String(err) });
  }
}
