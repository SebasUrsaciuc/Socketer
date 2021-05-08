const konsole = document.getElementById("k-content");
const edit = document.getElementById("edit");

input(`get ${window.location.pathname}`, true);

async function execute(c) {
    const args = c.split(" ");
    const cmd = args.shift();

    switch (cmd) {
        case "clear":
            while (edit.previousSibling) {
                konsole.removeChild(edit.previousSibling);
            }
            return;
        case "echo":
            println(args.join(" "));
            break;
        case "get":
            println("Getting response...");
            await fetch(args.join(" ")).then(response => {
                if(response.ok) {
                    infoln("Success! The page exist!");
                    window.location.href = args.join(" ");
                } else
                    errorln("Error error: page not found");
            })
            break;
        case "help":
            println("Here's an command list:");
            println("clear, echo, get, help");
            break;
        default:
            errorln(`"${cmd}" is not an command!`);
    }

    println("");
}

function error(v) {
    const e = document.createElement("span");
    e.innerText = v;
    e.classList.add("error");
    konsole.insertBefore(e, edit);
}

function errorln(v) {
    error(`${v}\n`);
}

function info(v) {
    const e = document.createElement("span");
    e.innerText = v;
    e.classList.add("info");
    konsole.insertBefore(e, edit);
}

function infoln(v) {
    info(`${v}\n`);
}

function print(v) {
    konsole.insertBefore(document.createTextNode(v), edit);
}

function println(v) {
    print(`${v}\n`);
}

function editing(v) {
    edit.contentEditable = v;
    edit.focus();
}

async function input(v, unFocus) {
    println(v);
    editing(false);

    if(v.length > 0)
        await execute(v);

    editing(true);
    print("> ");

    edit.innerHTML = "";

    konsole.scrollTop = konsole.scrollHeight;

    if(unFocus)
        edit.blur(); // un-focus
}

edit.onkeydown = function (e) {
    if(e.key === "Enter") {
        e.preventDefault();

        input(edit.innerText, false);
    }
}

konsole.onclick = function () {
    edit.focus();
}