const express = require("express");
const app = express();

app.use(express.json());

let currentUrl = "no link yet";

// 📥 принимаем ссылку от C#
app.post("/update", (req, res) => {
    currentUrl = req.body.url || "no link yet";
    console.log("UPDATED:", currentUrl);
    res.send("OK");
});

// 📤 отдаём ссылку Android
app.get("/", (req, res) => {
    res.send(currentUrl);
});

// Render port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
