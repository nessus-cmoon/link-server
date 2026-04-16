const express = require("express");
const app = express();

app.use(express.json());

let currentUrl = "no link yet";

// обновление ссылки с ПК
app.post("/update", (req, res) => {
    currentUrl = req.body.url;
    console.log("Updated:", currentUrl);
    res.send("ok");
});

// отдаём Android
app.get("/", (req, res) => {
    res.send(currentUrl);
});

app.listen(3000, () => console.log("Server running"));
