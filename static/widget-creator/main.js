import {def, len} from "../data";

const roomDOM = document.querySelector("#room input");
const roomLenDOM = document.querySelector("#room p");
const refreshDOM = document.querySelector("#refresh input");
const widthDOM = document.querySelector("#width input");
const heightDOM = document.querySelector("#height input");
const resultDOM = document.querySelector("#result .input")

roomDOM.placeholder = def.room;
roomDOM.maxLength = len.maxRoom;
roomLenDOM.innerText = len.maxRoom;
refreshDOM.placeholder = def.widget.refresh;
widthDOM.placeholder = def.widget.width;
heightDOM.placeholder = def.widget.height;

roomDOM.oninput = () => roomLenDOM.innerText = len.maxRoom - roomDOM.value.length;

setResult();

function setResult() {
    const room = encodeURIComponent(roomDOM.value.trim() || def.room);
    const refresh = parseInt(refreshDOM.value) || def.widget.refresh;
    const width = parseInt(widthDOM.value) || def.widget.width;
    const height = parseInt(heightDOM.value) || def.widget.height;

    resultDOM.innerHTML = "";

    function add(type, content) {
        const elem = document.createElement("span");
        elem.classList.add(type);
        elem.innerText = content;
        resultDOM.appendChild(elem);
    }

    function addTag(tag, attrs) {
        add("tagBrackets", "<");
        add("tag", tag);
        for(const [attr, val] of Object.entries(attrs)) {
            resultDOM.append(" ");
            add("attr", attr);
            add("val", `="${val}"`);
        }
        add("tagBrackets", "></");
        add("tag", tag);
        add("tagBrackets", ">");
    }

    addTag("iframe", {
        src: `${location.origin}/widget/${room}` + (refresh !== def.widget.refresh? `?refresh=${refresh}` : ""),
        width,
        height,
        allowtransparency: true,
        frameborder: 0
    });
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focusout", setResult);
});

function resultFocus() {
    const selection = window.getSelection();
    selection.removeAllRanges();

    const range = document.createRange();
    range.selectNodeContents(resultDOM);
    selection.addRange(range);
}

resultDOM.addEventListener("focusin", resultFocus);
resultDOM.addEventListener("click", resultFocus);