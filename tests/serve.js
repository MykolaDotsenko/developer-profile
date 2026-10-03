// Minimal static server for the browser tests. It mirrors GitHub Pages: the site lives under
// /developer-profile/, and unknown paths get 404.html with a 404 status.

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const PREFIX = "/developer-profile";
const PORT = Number(process.env.PORT || 4173);
const TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
};

function send(response, status, filePath) {
  response.writeHead(status, {
    "Content-Type": TYPES[path.extname(filePath)] || "application/octet-stream",
  });
  fs.createReadStream(filePath).pipe(response);
}

http
  .createServer((request, response) => {
    let urlPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (urlPath === PREFIX) {
      urlPath += "/";
    }
    if (!urlPath.startsWith(`${PREFIX}/`)) {
      send(response, 404, path.join(ROOT, "404.html"));
      return;
    }

    urlPath = urlPath.slice(PREFIX.length);
    if (urlPath.endsWith("/")) {
      urlPath += "index.html";
    }

    const filePath = path.join(ROOT, urlPath);
    const relative = path.relative(ROOT, filePath);
    const isPublic =
      !relative.startsWith("..") &&
      !relative.split(path.sep).some((part) => part.startsWith(".") || part === "node_modules");

    if (!isPublic || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      send(response, 404, path.join(ROOT, "404.html"));
      return;
    }

    send(response, 200, filePath);
  })
  .listen(PORT, "127.0.0.1", () => {
    console.log(`Serving ${ROOT} at http://127.0.0.1:${PORT}${PREFIX}/`);
  });
