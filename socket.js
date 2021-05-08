import { server } from "./app.js";
import { Server } from "socket.io";
import { len } from "./static/data.js";

const io = new Server(server);

export function getUsers(room) {
    return [...(io.sockets.adapter.rooms.get(room) ?? [])].map(x => io.sockets.sockets.get(x).username);
}

io.on("connection", client => {
    client.on("join", ({username, room}) => {
        const nameChangeCauses = [];
        const roomChangeCauses = [];

        if(username.length > len.maxName) {
            username = username.substring(0, len.maxName);
            nameChangeCauses.push("lengthExceed");
        }

        if(room.length > len.maxRoom) {
            room = room.substring(0, len.maxRoom);
            roomChangeCauses.push("lengthExceed");
        }

        const originalUN = username;
        const users = getUsers(room);

        for(let i = 2; users.find(x => x === username) !== undefined; i++) {
            username = `${originalUN} (${i})`;

            if(i === 2)
                nameChangeCauses.push("alreadyExist");
        }

        client.username = username;
        client.join(room);

        const joinDate = new Date().toUTCString();

        client.broadcast.to(room).emit("join", {
            time: joinDate,
            username
        });

        client.emit("join/confirm", {
            time: joinDate,
            finalName: username,
            finalRoom: room,
            nameChangeCauses,
            roomChangeCauses,
            users
        });

        client.on("message", ({content}) => {
            client.broadcast.to(room).emit("message", {
                content: content.substring(0, len.maxChat),
                author: username,
                time: (new Date()).toUTCString()
            });
        });

        client.on("typingStateChange", ({typing}) => {
            client.broadcast.to(room).emit(typing? "startTyping" : "stopTyping", {username});
        });

        client.on("disconnect", () => {
            client.broadcast.to(room).emit("leave", {
                time: new Date().toUTCString(),
                username
            });
        });
    });
});