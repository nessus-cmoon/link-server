const express = require("express");
const app = express();

app.use(express.json());

// 🟢 состояние сервера
let state = {
    updated: false,
    deviceName: "unknown",
    online: false,
    screenOn: false,
    apps: [],
    notifications: []
};

// 🟢 Android отправляет данные сюда
app.post("/push", (req, res) => {
    try {
        const data = req.body || {};

        state.deviceName = data.deviceName || "unknown";
        state.online = true;
        state.screenOn = data.screenOn || false;
        state.apps = data.apps || [];
        state.notifications = data.notifications || [];

        state.updated = true;

        console.log("📩 DATA RECEIVED");
        res.json({ ok: true });

    } catch (e) {
        console.log("ERROR PUSH:", e);
        res.status(500).json({ ok: false });
    }
});

// 🟢 C# читает состояние
app.get("/heartbeat", (req, res) => {
    res.json(state);

    // сбрасываем флаг обновления после отдачи
    state.updated = false;
});

// 🟢 проверка сервера
app.get("/", (req, res) => {
    res.send("SERVER OK");
});

// 🟢 запуск
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("SERVER RUNNING ON PORT " + PORT);
});
