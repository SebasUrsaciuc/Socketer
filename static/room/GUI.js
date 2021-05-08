import {colors} from "../data";
import {randomI} from "../common/main";

const iconDOM = document.querySelector("link[rel=icon]");
export const chatDOM = document.getElementById("chat");
export const inputDOM = document.getElementById("input");
export const lremDOM = document.getElementById("lrem");
export const splashDOM = document.getElementById("splash");
export const typing = {
    base: "typing",
    label: document.querySelector(".sidebar [for=typing]"),
    container: document.querySelector(".sidebar #typing")
};
export const joined = {
    base: "joined",
    label: document.querySelector(".sidebar [for=joined]"),
    container: document.querySelector(".sidebar #joined")
};

let lastDistanceFromTop = 0;

document.onvisibilitychange = function () {
    if(document.visibilityState === "hidden") {
        lastDistanceFromTop = getDistanceFromTop();
    } else {
        setScrollToLast(lastDistanceFromTop);
    }
}

function getDistanceFromTop() {
    return (chatDOM.scrollHeight - chatDOM.clientHeight) - chatDOM.scrollTop;
}

function setScrollToLast(dft = getDistanceFromTop()) {
    if(dft < 600 && document.visibilityState === "visible")
        chatDOM.scrollTop = chatDOM.scrollHeight;
}

function parseText(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

const userColors = { };

function getColor(user) {
    if(userColors[user] === undefined)
        userColors[user] = colors[randomI(0, colors.length)];

    return userColors[user];
}

export function removeColor(user) {
    delete userColors[user];
}

export function ready() {
    splashDOM.classList.add("ready");
}

export function moveUser(name, elem, to) {
    removeUser(name, elem);
    addUser(name, to);
}

export function thereIsUser(name, elem) {
    return [...elem.container.childNodes].map(x => x.innerText).includes(name);
}

export function addUser(name, elem) {
    if(thereIsUser(name, elem))
        return;

    const e = document.createElement("p");
    e.innerText = name;

    const childs = elem.container.childNodes;

    elem.label.innerText = `${elem.base} - ${childs.length + 1}`;

    for(const child of childs) {
        if(name < child.innerText) {
            elem.container.insertBefore(e, child);
            return;
        }
    }

    elem.container.appendChild(e);
}

export function removeUser(name, elem) {
    elem.container.childNodes.forEach(x => {
        if(x.innerText === name)
            x.remove();
    });

    elem.label.innerText = `${elem.base} - ${elem.container.childNodes.length}`;
}

export function addMessage(author, time, content, side, type) {
    const msg = document.createElement("div");
    msg.classList.add("message");
    msg.classList.add(side);
    msg.classList.add(type);

    const data = document.createElement("div");
    data.classList.add("data");

    if(side === "client") {
        const auth = document.createElement("p");
        auth.classList.add("author");
        auth.innerText = author;
        data.appendChild(auth);
    }

    const date = document.createElement("p");
    date.classList.add("time");
    date.innerText = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    data.appendChild(date);

    msg.appendChild(data);

    const cont = document.createElement("pre");
    cont.classList.add("content");
    cont.innerHTML = parseText(content);
    if(type === "ext" && side === "client")
        cont.style.setProperty("--c", getColor(author));
    msg.appendChild(cont);

    chatDOM.appendChild(msg);

    setScrollToLast();
}

const favLogo = new Image();
favLogo.src = "/static/common/favicon.svg";
export function drawFavicon(num) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 32;

    canvas.width = size;
    canvas.height = size;

    if(num !== undefined && num > 0) {
        ctx.drawImage(favLogo, 2, 2, size - 4, size - 4);

        num = num > 99? "99+" : num.toString();

        ctx.fillStyle = "#4444FF";
        ctx.fillRect(0, size - 18, size, 18);

        ctx.textAlign = "center";
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(num, size / 2, size - 2);
    } else
        ctx.drawImage(favLogo, 0, 0, size, size);

    iconDOM.href = canvas.toDataURL();
}