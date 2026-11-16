
const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.join(publicDir, requested);
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403); return res.end("Forbidden");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    const ext = path.extname(filePath);
    const types = { ".html":"text/html; charset=utf-8", ".js":"text/javascript", ".css":"text/css" };
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    res.end(data);
  });
});

const wss = new WebSocket.Server({ server });
const players = new Map();
const id = () => Math.random().toString(36).slice(2, 9);

function broadcast(payload, except) {
  const data = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client !== except && client.readyState === WebSocket.OPEN) client.send(data);
  }
}

wss.on("connection", socket => {
  const playerId = id();
  players.set(playerId, { id: playerId, name: "Gorilla", x: 0, y: 1.4, z: 0, color: Math.floor(Math.random()*0xffffff) });
  socket.playerId = playerId;
  socket.send(JSON.stringify({ type: "welcome", id: playerId, players: [...players.values()].filter(p => p.id !== playerId) }));
  broadcast({ type: "joined", player: players.get(playerId) }, socket);

  socket.on("message", raw => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    if (msg.type === "move" && players.has(playerId)) {
      const p = players.get(playerId);
      for (const key of ["x", "y", "z", "yaw"]) {
        if (Number.isFinite(msg[key])) p[key] = Math.max(-500, Math.min(500, msg[key]));
      }
      if (typeof msg.name === "string") p.name = msg.name.slice(0, 18);
      broadcast({ type: "moved", player: p }, socket);
    }
  });

  socket.on("close", () => {
    players.delete(playerId);
    broadcast({ type: "left", id: playerId });
  });
});

server.listen(PORT, "0.0.0.0", () => console.log(`Gorilla Forest VR running on http://localhost:${PORT}`));
