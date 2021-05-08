import {
    addMessage,
    addUser,
    drawFavicon,
    inputDOM,
    joined,
    lremDOM,
    moveUser,
    ready,
    removeColor,
    removeUser,
    typing
} from "./GUI";
import {genName} from "../common/main";
import {len} from "../data";

let username = NAME || genName();
let room = ROOM;

lremDOM.innerText = len.maxChat.toString();

setTimeout(() => {
    const socket = io();

    let isTyping = false;
    let lastTypingTimeout = 0;
    function stopTyping() {
        if(isTyping) {
            socket.emit("typingStateChange", { typing: false });
            isTyping = false;
        }
    }

    inputDOM.oninput = function (e) {
        const content = inputDOM.value.trim();

        const diff = len.maxChat - content.length;
        lremDOM.innerText = diff < -999? "-999+" : diff;
        if(diff < 0)
            lremDOM.classList.add("much");
        else
            lremDOM.classList.remove("much");

        if(inputDOM.value.length > 0) {
            if(!isTyping) {
                socket.emit("typingStateChange", { typing: true });
                isTyping = true;
            }

            clearTimeout(lastTypingTimeout);
            lastTypingTimeout = setTimeout(stopTyping, 3000);
        } else {
            clearTimeout(lastTypingTimeout);
            stopTyping();
        }
    }

    inputDOM.onkeydown = function (e) {
        const content = inputDOM.value.trim();

        if(e.key !== "Enter")
            return;

        if(content.length < 1 || content.length > len.maxChat)
            return;

        const data = {
            content
        }

        clearTimeout(lastTypingTimeout);
        stopTyping();
        socket.emit("message", data);

        addMessage(username, new Date(), data.content,"client", "int");

        inputDOM.value = "";
        lremDOM.innerText = len.maxChat.toString();
    }

    socket.emit("join", {
        username,
        room
    });

    socket.on("join/confirm", ({time, finalName, finalRoom, nameChangeCauses, roomChangeCauses, users}) => {
        inputDOM.placeholder = `Send something in ${finalRoom}...`;

        users.forEach(x => addUser(x, joined));

        let welcome = `Welcome to "${finalRoom}" room!`;
        if(nameChangeCauses.length > 0) {
            let counter = 0;

            welcome += ` Your name was changed from "${username}" to "${finalName}" because `;

            function add(code, phrase, last = false) {
                if(nameChangeCauses.includes(code)) {
                    if(counter > 0)
                        welcome += last? " and " : ", ";

                    welcome += phrase;
                    counter++;
                }
            }

            add("lengthExceed", `its length exceeded the limit of ${len.maxName} characters`);
            add("alreadyExist", "it is already used by another user", true);

            welcome += '.';
        }
        if(roomChangeCauses.length > 0) {
            welcome += ` ${nameChangeCauses.length > 0? "Also your" : "Your"} room changed from "${room}" to "${finalRoom}" because `;

            if(roomChangeCauses.includes("lengthExceed")) {
                welcome += `its length exceeded the limit of ${len.maxRoom} characters`;
            }

            welcome += '.';
        }
        addMessage(undefined, new Date(time), welcome, "server", "ext");

        username = finalName;
        room = finalRoom;

        ready();
    });

    socket.on("join", ({time, username}) => {
        addMessage(undefined, new Date(time), `${username} joined the room!`, "server", "ext");
        addUser(username, joined);
    });

    socket.on("leave", ({time, username}) => {
        addMessage(undefined, new Date(time), `${username} left the room!`, "server", "ext");
        removeColor(username);
        removeUser(username, joined);
        removeUser(username, typing);
    });

    let newMsg = 0;
    document.addEventListener("visibilitychange", function () {
        if(document.visibilityState === "visible") {
            newMsg = 0;
            drawFavicon();
        }
    });
    socket.on("message", ({author, time, content}) => {
        moveUser(author, typing, joined);
        addMessage(author, new Date(time), content, "client", "ext");

        if(document.visibilityState === "hidden") {
            newMsg++;
            drawFavicon(newMsg);
            const audio = new Audio("/static/room/notify.wav");
            audio.volume = 0.5;
            audio.play();
        }
    });

    socket.on("startTyping", ({username}) => {
        moveUser(username, joined, typing);
    });

    socket.on("stopTyping", ({username}) => {
        moveUser(username, typing, joined);
    });
}, 1000);