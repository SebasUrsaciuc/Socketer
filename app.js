import express from "express";
import {getUsers} from "./socket.js";

const app = express();
export const server = app.listen(process.env.PORT || 3000);

app.set("view engine", "ejs");
app.use(express.Router({ strict: true }));
app.use("/static", express.static("static", { extensions: ["js"] }));
app.use((req, res, next) => {
    try {
        decodeURIComponent(req.path);
        next();
    } catch (err) {
        to404(req, res);
    }
});



// PAGES
app.get("/:path(index)?", (req, res) => {
    res.redirect("/join");
});

app.get("/join", (req, res) => {
    res.render("join");
});

app.get("/rooms/", (req, res) => {
    res.redirect("/join");
});

app.get("/rooms/:room", (req, res) => {
    res.render("room", { room: unescape(req.params.room), name: (req.query.name !== undefined? unescape(req.query.name) : undefined) });
});

app.get("/widget", (req, res) => {
    res.redirect(`/widget-creator`);
});

app.get("/widget/:room", (req, res) => {
    res.render("widget", { users: getUsers(unescape(req.params.room)), room: req.params.room, refresh: Math.max(req.query.refresh, 30) });
});

app.get("/widget-creator", (req, res) => {
    res.render("widget-creator");
});

app.get("/*", to404);

function to404(req, res) {
    res.status(404).render("404");
}