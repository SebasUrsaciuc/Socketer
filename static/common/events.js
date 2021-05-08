document.body.addEventListener("mousedown", function() {
    document.body.setAttribute("input-type", "mouse");
});

document.body.addEventListener("keydown", function(event) {
    document.body.setAttribute("input-type", event.key === "Tab"? "tab" : "keyboard");
});

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focusin", function () {
        input.setSelectionRange(input.value.length, input.value.length);
    });
});

document.querySelectorAll("input.number").forEach(input => {
    let lastValue = "";

    input.addEventListener("input", e => {
        if(!/^[0-9]*$/.test(input.value))
            input.value = lastValue;
        else
            lastValue = input.value;
    });

    input.addEventListener("focusout", () => {
        if(input.value.trim().length <= 0)
            return;

        let value = parseInt(input.value) || 0;

        const min = parseInt(input.getAttribute("min")) || Number.MIN_SAFE_INTEGER;
        const max = parseInt(input.getAttribute("max")) || Number.MAX_SAFE_INTEGER;

        input.value = Math.max(min, Math.min(max, value)).toString();
    });
});