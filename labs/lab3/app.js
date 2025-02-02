const m = require('./public/modules/math');
const dt = require('./public/modules/utils');
const userLang = require('./public/lang/en');
const http = require('http');
const url = require('url');
const fs = require('fs');

const file = "file.txt";

class Server {
    start() {
        http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const pathname = parsedUrl.pathname;

            if (pathname === "/writeFile/") {
                this.writeFile(parsedUrl, res);
            } else if (pathname.startsWith("/readFile/")) {
                const filename = pathname.replace("/readFile/", "").trim();
                this.readFile(filename, res);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(this.getDate(parsedUrl));
                res.end();
            }
        }).listen(8888);
    }

    getDate(parsedUrl) {
        let person = parsedUrl.query["name"] || "Unknown";
        let message = userLang.msg.userString.replace("%1", person) + dt.date();
        return `<h2 style="color: blue; font-family: Arial, sans-serif;">${message}</h2>`;
    }

    writeFile(parsedUrl, res) {
        const content = parsedUrl.query['text'];

        if (!content) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(userLang.msg.missingText);
            return;
        }

        // Append text instead of overwriting
        fs.appendFile(file, content + "\n", (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(userLang.msg.failWrite);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(userLang.msg.successWrite);
            }
        });
    }

    readFile(filename, res) {
        if (!filename) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(userLang.msg.missingFilename);
            return;
        }

        fs.readFile(filename, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(userLang.msg.errorReadingFile);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            }
        });
    }
}

const server = new Server();
server.start();
console.log("Server up and running...");
