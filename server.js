const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let devices = {};

// 📱 регистрация / обновление устройства
app.post("/registerDevice", (req, res) => {
    const name = req.body.deviceName;

    if (!name) return res.json({ ok: false });

    devices[name] = {
        deviceName: name,
        lastSeen: Date.now()
    };

    res.json({ ok: true });
});

// 📊 статус для C#
app.get("/status", (req, res) => {

    const now = Date.now();

    let list = Object.values(devices).map(d => {
        return {
            deviceName: d.deviceName,
            online: (now - d.lastSeen) < 15000 // 15 сек онлайн
        };
    });

    res.json({ devices: list });
});

app.get("/", (req, res) => {
    res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
