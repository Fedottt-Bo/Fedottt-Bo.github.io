const http = require("http");
const url = require('url');
const fs = require('fs').promises;
const expr = require('express');

const host = 'localhost';
const port = 8000;

var messages = [];

const requestListener = function (req, res) {
    /*console.log(
        `Request: ${req.method}, ${req.url}`
    );*/

    let fileName;
    let contentType;

    if (req.method === 'POST') {
        let data = "";
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            try {
                let msg = JSON.parse(data);
                let CurDate = new Date(Date.now());
                let time = `${CurDate.getHours().toString()}:${CurDate.getMinutes().toString()}:${CurDate.getSeconds().toString()}`;
                messages.push({ name: msg.name, time: time, text: msg.text });
            }
            catch (err) {
                console.log(err);
            }
            res.end();
            return;
        })
    }
    else if (req.method === 'GET') {
        if (req.url === "/") {
            fileName = "index.html";
            contentType = "text/html";
        }
        else if (req.url === "/favicon.ico") {
            fileName = "yobagram.ico";
            contentType = "image/x-icon";
        }
        else if (req.url.endsWith(".png") || req.url.endsWith(".jpg") || req.url.endsWith(".gif")) {
            fileName = req.url.substr(1);
            contentType = "image/png";
        }
        else if (req.url === "/Update") {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(GenMessageList());
            return;
        }
        else if (req.url.endsWith(".css")) {
            fileName = req.url.substr(1);
            contentType = "text/css";
        } else {
            res.writeHead(500);
            res.end("Error, unsupported");
            return;
        }

        fs.readFile(`${__dirname}/${fileName}`)
            .then(contents => {
                res.setHeader("Content-Type", contentType);
                res.writeHead(200);
                res.end(contents);
            })
            .catch(err => {
                res.writeHead(500);
                res.end(err);
                return;
            });
    }
};

function GenMessageList() {
    tmp = "";
    messages.forEach(function (val, i) { tmp += `${val.name} (${val.time}): ${val.text}\n`; });
    return tmp;
}

const server = http.createServer(requestListener);
server.listen(port);

// http://192.168.30.70:8000
