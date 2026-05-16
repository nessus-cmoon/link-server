const express = require("express");
const app = express();

app.use(express.json());

const devices = {};

// 🔌 получение heartbeat от Android
app.post("/heartbeat", (req, res) => {
    const { deviceName, screenOn, apps, timestamp } = req.body;

    devices[deviceName] = {
        deviceName,
        screenOn,
        apps: apps || [],
        lastSeen: Date.now()
    };

    res.sendStatus(200);
});

// 📊 список устройств для панели
app.get("/devices", (req, res) => {

    const now = Date.now();

    const result = Object.values(devices).map(d => {
        return {
            deviceName: d.deviceName,
            screenOn: d.screenOn,
            apps: d.apps,
            online: (now - d.lastSeen) < 15000,
            lastSeenAgo: Math.floor((now - d.lastSeen) / 1000)
        };
    });

    res.json(result);
});

app.listen(3000, () => {
    console.log("Server running");
});
