const express = require('express');
const { execFile } = require('child_process');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// LOGIN API
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const exePath = __dirname + "\\backend\\bank.exe";

    console.log("EXE PATH:", exePath);
    console.log("ARGS:", username, password);

    execFile(exePath, ['login', username, password], (error, stdout, stderr) => {
        if (error) {
            console.log("ERROR:", error);
            return res.json({ success: false });
        }

        console.log("OUTPUT:", stdout);

        if (stdout.trim() === "SUCCESS")
            res.json({ success: true });
        else
            res.json({ success: false });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));