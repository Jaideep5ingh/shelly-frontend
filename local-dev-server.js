const http = require("node:http");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const { forward } = require("./lib/forward");

const PORT = Number(process.env.PORT || 3100);
const ROOT = process.cwd();

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function sendText(res, statusCode, text, contentType) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", contentType);
  res.end(text);
}

async function readJsonBody(req) {
  return await new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > 8 * 1024) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", (error) => reject(error));
  });
}

const server = http.createServer(async (req, res) => {
  const method = req.method || "GET";
  const url = req.url || "/";

  if (method === "GET" && url === "/") {
    const html = await readFile(path.join(ROOT, "index.html"), "utf8");
    sendText(res, 200, html, "text/html; charset=utf-8");
    return;
  }

  if (method === "GET" && url === "/style.css") {
    const css = await readFile(path.join(ROOT, "public/style.css"), "utf8");
    sendText(res, 200, css, "text/css; charset=utf-8");
    return;
  }

  if (method === "GET" && url === "/app.js") {
    const js = await readFile(path.join(ROOT, "public/app.js"), "utf8");
    sendText(res, 200, js, "application/javascript; charset=utf-8");
    return;
  }

  if (method === "POST" && url === "/api/subscribe") {
    try {
      const body = await readJsonBody(req);
      const result = await forward("subscribe", {
        email: body?.email,
        website: body?.website
      });
      sendJson(res, result.statusCode, result.body);
    } catch {
      sendJson(res, 400, { message: "Invalid request" });
    }
    return;
  }

  if (method === "POST" && url === "/api/feedback") {
    try {
      const body = await readJsonBody(req);
      const result = await forward("feedback", {
        email: body?.email,
        feedback: body?.feedback,
        website: body?.website
      });
      sendJson(res, result.statusCode, result.body);
    } catch {
      sendJson(res, 400, { message: "Invalid request" });
    }
    return;
  }

  sendJson(res, 404, { message: "Not found" });
});

server.listen(PORT, () => {
  process.stdout.write(`shelly-frontend local server listening on http://localhost:${PORT}\n`);
});
