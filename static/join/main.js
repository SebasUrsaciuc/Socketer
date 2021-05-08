import {genName} from "../common/main";
import {def, len} from "../data";

const nameDOM = document.querySelector("#name input");
const roomDOM = document.querySelector("#room input");
const nameLenDOM = document.querySelector("#name p");
const roomLenDOM = document.querySelector("#room p");
const joinDOM = document.getElementById("join");

nameDOM.placeholder = genName();
roomDOM.placeholder = def.room;
nameDOM.maxLength = len.maxName;
roomDOM.maxLength = len.maxRoom;
nameLenDOM.innerText = len.maxName;
roomLenDOM.innerText = len.maxRoom;

nameDOM.oninput = () => nameLenDOM.innerText = len.maxName - nameDOM.value.length;
roomDOM.oninput = () => roomLenDOM.innerText = len.maxRoom - roomDOM.value.length;

joinDOM.onclick = function () {
    window.location.href = `/rooms/${encodeURIComponent(roomDOM.value || def.room)}?name=${encodeURIComponent(nameDOM.value || nameDOM.placeholder)}`;
}