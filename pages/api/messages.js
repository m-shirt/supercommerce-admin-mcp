// pages/api/sseMessage.js (or app/api/sseMessage/route.js depending on your setup)

import { sseMessageHandler } from '../../mcpServer.js'; 

// ✅ Disable Next.js body parsing so req stays a stream
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  return sseMessageHandler(req, res);
}
