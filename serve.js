/* Dependency-free static server for local development (serves dist/). */

const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "dist");
const port = process.env.PORT || 3000;

const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

const server = http.createServer((request, response) => {
    let urlPath = decodeURIComponent(
        (request.url || "/").split("?")[0]
    );

    if (urlPath === "/") {
        urlPath = "/index.html";
    }

    const filePath = path.join(
        root,
        path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "")
    );

    if (!filePath.startsWith(root)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, data) => {
        if (error) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.end("Not found");
            return;
        }

        response.writeHead(200, {
            "Content-Type":
                types[path.extname(filePath).toLowerCase()] ||
                "application/octet-stream"
        });

        response.end(data);
    });
});

server.listen(port, () => {
    console.log("FixMyCity running at http://localhost:" + port);
});
