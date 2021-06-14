const http = require("http");
const url = require('url');
const fs = require('fs').promises;

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
                messages.push(JSON.parse(data));
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
