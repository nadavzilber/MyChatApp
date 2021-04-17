const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

const initialState = {
    chats: {
        "General": { msgs: [] },
        "Sports": { msgs: [] },
        "Music": { msgs: [] }
    }
};

let state = Object.assign({}, initialState);

io.on("connection", socket => {
    socket.emit("your-id", socket.id);

    socket.on("client-message", data => {
        state.chats[data.room].msgs.push({ room: data.room, id: data.id, username: data.username, body: data.body, time: new Date().toLocaleString() });
        let msgs = state.chats[data.room].msgs;
        io.in(data.room).emit("server-message", msgs);
    });

    socket.on("client-action", data => {
        let loginStatus;
        if (data.actionType === "join-room") {
            socket.join(data.room);
            loginStatus = true;
        }
        else if (data.actionType === "leave-room") {
            socket.leave(data.room);
            loginStatus = false;
        }
        state.chats[data.room].msgs.push({ room: data.room, id: "System", username: "System", body: `${data.username} has ${data.actionType === 'join-room' ? 'joined' : 'left'} the ${data.room} chat room.`, time: new Date().toLocaleString() });
        let msgs = state.chats[data.room].msgs;
        io.to(socket.id).emit("login", loginStatus);
        io.in(data.room).emit("server-message", msgs);
    });

});

server.listen(8000, () => console.log('server is running on port 8000'));