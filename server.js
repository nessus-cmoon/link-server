const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let devices = {};
let seen = {};

app.post("/updateStatus", (req, res) => {
    const d = req.body;

    const isNew = !seen[d.deviceName];
    seen[d.deviceName] = true;

    devices[d.deviceName] = {
        ...d,
        lastSeen: Date.now()
    };

    res.json({ ok: true, newDevice: isNew });
});

app.get("/status", (req, res) => {
    const now = Date.now();

    const list = Object.values(devices).map(d => ({
        deviceName: d.deviceName,
        online: now - d.lastSeen < 15000,
        screenOn: d.screenOn,
        notif: d.notif,
        access: d.access,
        appsCount: d.apps?.length || 0
    }));

    res.json({ devices: list });
});

app.listen(process.env.PORT || 3000);
