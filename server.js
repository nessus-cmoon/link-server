const express = require("express");
const app = express();

app.use(express.json());

// 🟢 STATE
let state = {
    deviceName: "unknown",
    online: false,
    screenOn: false,
    apps: [],
    notifications: [],
    updated: false
};

let lastPing = 0;

// 🟢 CONNECT SIGNAL
app.post("/connect", (req, res) => {
    state.deviceName = req.body.deviceName || "unknown";
    state.online = true;

    lastPing = Date.now();

    console.log("🔌 CONNECT:", state.deviceName);

    res.json({ ok: true });
});

// 🟢 DATA PUSH
app.post("/push", (req, res) => {
    try {
        const data = req.body || {};

        state.deviceName = data.deviceName || "unknown";
        state.screenOn = data.screenOn || false;
        state.apps = data.apps || [];
        state.notifications = data.notifications || [];
        state.updated = true;

        lastPing = Date.now();

        console.log("📩 PUSH DATA");

        res.json({ ok: true });
    } catch (e) {
        console.log("ERROR PUSH:", e);
        res.status(500).json({ ok: false });
    }
});

// 🟢 HEARTBEAT (C#)
app.get("/heartbeat", (req, res) => {
    res.json(state);
    state.updated = false;
});

// 🟢 OFFLINE CHECK
setInterval(() => {
    if (Date.now() - lastPing > 8000) {
        state.online = false;
    }
}, 3000);

// 🟢 ROOT
app.get("/", (req, res) => {
    res.send("SERVER OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("RUNNING " + PORT));
