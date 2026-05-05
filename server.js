const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let devices = {};

// 📱 обновление статуса
app.post("/updateStatus", (req, res) => {
    const d = req.body;

    if (!d.deviceName) return res.json({ ok: false });

    devices[d.deviceName] = {
        deviceName: d.deviceName,
        screenOn: d.screenOn || false,
        apps: d.apps || [],
        lastSeen: Date.now()
    };

    res.json({ ok: true });
});

// 📊 статус для панели
app.get("/status", (req, res) => {
    const now = Date.now();

    const list = Object.values(devices).map(d => ({
        deviceName: d.deviceName,
        screenOn: d.screenOn,
        appsCount: d.apps.length,
        online: now - d.lastSeen < 15000
    }));

    res.json({ devices: list });
});

app.get("/", (req, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT);
