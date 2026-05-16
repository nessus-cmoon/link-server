const express = require("express");
const app = express();

app.use(express.json());

// 🧠 временное хранилище устройства
let deviceState = {
    deviceName: "unknown",
    online: false,
    screenOn: false,
    apps: [],
    notifications: [],
    lastSeen: 0
};

// 🔵 ROOT
app.get("/", (req, res) => {
    res.send("Server is running");
});

// 🔵 HEARTBEAT (C# читает отсюда)
app.get("/heartbeat", (req, res) => {
    res.json(deviceState);
});

// 🔵 RECEIVE DATA FROM ANDROID
app.post("/heartbeat", (req, res) => {

    const data = req.body;

    deviceState = {
        deviceName: data.deviceName || deviceState.deviceName,
        online: true,
        screenOn: data.screenOn || false,
        apps: data.apps || [],
        notifications: data.notifications || [],
        lastSeen: Date.now()
    };

    res.json({ status: "ok" });
});

// 🔵 SIMPLE STATUS CHECK
app.get("/status", (req, res) => {
    res.json({
        online: true,
        lastSeen: deviceState.lastSeen
    });
});

// 🔵 AUTO OFFLINE CHECK (простая логика)
setInterval(() => {
    const now = Date.now();

    if (now - deviceState.lastSeen > 15000) {
        deviceState.online = false;
    }
}, 5000);

// 🔵 START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
