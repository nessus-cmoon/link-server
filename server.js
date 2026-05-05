const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let devices = {};

// принять или обновить устройство
app.post("/registerDevice", (req, res) => {
    const name = req.body.deviceName;

    if (!name) return res.status(400).json({ ok: false });

    devices[name] = {
        deviceName: name,
        lastSeen: Date.now()
    };

    res.json({ ok: true });
});

// список устройств
app.get("/status", (req, res) => {
    const now = Date.now();

    const list = Object.values(devices).map(d => ({
        deviceName: d.deviceName,
        online: now - d.lastSeen < 15000
    }));

    res.json({ devices: list });
});

// health check
app.get("/", (req, res) => {
    res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
