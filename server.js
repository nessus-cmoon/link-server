const express = require("express");
const app = express();

let url = "no link yet";

// C# отправляет ссылку сюда
app.get("/set", (req, res) => {
    url = req.query.url;
    console.log("UPDATED:", url);
    res.send("ok");
});

// Android читает отсюда
app.get("/", (req, res) => {
    res.send(url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
