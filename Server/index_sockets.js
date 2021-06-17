const express = require('express');
const favicon = require('serve-favicon')
const app = express();
const http = require('http');
var cookieParser = require('cookie-parser');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cookieParser());

var messages = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index_sockets.html');
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


io.on('connection', (socket) => {
    try {
        console.log(`${socket.handshake.query.name} connected`);
    }
    catch (err) {
        console.log(err);
    }

    socket.on('disconnect', () => {
        try {
            console.log(`${socket.handshake.query.name} disconnected`);
        }
        catch (err) {
            console.log(err);
        }
    });

    socket.on('message', function (msg) {
        try {
            console.log(`new message: ${msg}`);
            let data = JSON.parse(msg);
            console.log(data);
            let CurDate = new Date(Date.now());
            let time = `${CurDate.getHours().toString()}:${CurDate.getMinutes().toString()}:${CurDate.getSeconds().toString()}`;
            let name = "ERROR!";
            try {
                name = socket.handshake.query.name;
            }
            catch (err) {
                console.log(err);
            }
            let message = { name: name, time: time, text: data.text };
            console.log(message);
            io.emit('message', message);
            messages.push(message);
        }
        catch (err) {
            console.log(err);
        }
    });
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});