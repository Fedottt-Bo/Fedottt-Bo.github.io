const express = require('express');
const favicon = require('serve-favicon')
const app = express();
const http = require('http');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

const server = http.createServer(app);

var messages = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    res.cookie("TestCookie", 47);
});

app.use(express.static('images'));
app.use(express.static('css'));
app.use(favicon(__dirname + '/images/yobagram.ico'));

app.get('/Update', function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(GenMessageList());
    return;
});

function GenMessageList() {
    tmp = "";
    messages.forEach(function (val, i) { tmp += `${val.name} (${val.time}): ${val.text}\n`; });
    return tmp;
}

app.post('/', function (req, res) {
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
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});