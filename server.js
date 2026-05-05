const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let devices = {};

// 📱 Android отправляет статус
app.post("/updateStatus", (req, res) => {
    const data = req.body;

    const isNew = !devices[data.deviceName];

    devices[data.deviceName] = {
        ...data,
        lastSeen: Date.now()
    };

    res.json({
        ok: true,
        isNew: isNew
    });
});

// 📊 Панель получает ВСЁ + новые устройства
app.get("/status", (req, res) => {
    const list = Object.values(devices);

    res.json({
        devices: list,
        newDevices: list.filter(d => Date.now() - d.lastSeen < 10000)
    });
});

// 🟢 health check
app.get("/", (req, res) => {
    res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
