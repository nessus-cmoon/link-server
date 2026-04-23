const express = require("express");
const crypto = require("crypto");

const app = express();

let currentUrl = "No link yet";

const SECRET = "MY_SUPER_SECRET_123";

function verify(url, hash) {
    const valid = crypto
        .createHash("sha256")
        .update(url + SECRET)
        .digest("hex");

    return valid === hash;
}

app.get("/set", (req, res) => {
    const { url, hash } = req.query;

    if (!url || !hash || !verify(url, hash)) {
        return res.send("denied");
    }

    currentUrl = url;
    console.log("UPDATED:", url);

    res.send("ok");
});

app.get("/", (req, res) => {
    res.send(currentUrl);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
