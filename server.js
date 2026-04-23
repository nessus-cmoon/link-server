const express = require("express");
const crypto = require("crypto");

const app = express();

// текущие данные (что видит Android)
let currentData = "No link yet";

// секрет (НЕ в Android, только тут и в C#)
const SECRET = "MY_SUPER_SECRET_123";

// проверка подписи
function verify(value, hash) {
    const valid = crypto
        .createHash("sha256")
        .update(value + SECRET)
        .digest("hex");

    return valid === hash;
}

// 🔐 обновление данных (только через C#)
app.get("/set", (req, res) => {
    const { url, hash } = req.query;

    if (!url || !hash || !verify(url, hash)) {
        return res.send("denied");
    }

    currentData = url;
    console.log("UPDATED:", url);

    res.send("ok");
});

// 📱 Android / любой клиент читает тут
app.get("/", (req, res) => {
    res.send(currentData);
});

// health check (Render любит это)
app.get("/health", (req, res) => {
    res.send("alive");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
