//DEPENDs
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const data = require("./db/db.json");
const shortUniqueId = require("short-unique-id");
//Server stuff
const app = express();
const PORT = process.env.PORT || 8080;

//ASYNCs
const readFileSync = util.promisify(fs.readFile);
const writeFileSync = util.promisify(fs.writeFile);

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const uid = new shortUniqueId({ length: 200 });

//Front End Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/assets/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/assets/notes.html"));
});

//Back End Routes
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "db/db.json"));
});
//Recieving from Front End
app.post("/api/notes", (req, res) => {
    const note = req.body;
    // console.log(note);
    note.id = uid();
    data.unshift(note);
    // res.send("note added!!");
    writeFileSync("./db/db.json", JSON.stringify(data));
    res.sendFile(path.join(__dirname, "db/db.json"));
});

app.get("*", (req, res) => {
    res.send("error");
});
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});