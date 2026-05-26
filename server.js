const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "frontend")));

/* ================= IN-MEMORY DATABASE ================= */

let users = [
    {
        username: "user1",
        password: "1234",
        account_number: "4382",
        balance: 12000,
        status: "ACTIVE",
        pin: "1234"
    },
    {
        username: "user2",
        password: "1234",
        account_number: "5281",
        balance: 15000,
        status: "ACTIVE",
        pin: "1234"
    },
    {
        username: "user3",
        password: "1234",
        account_number: "7610",
        balance: 18000,
        status: "ACTIVE",
        pin: "1234"
    }
];

let transactions = [];

let appointments = [];

/* ================= HOME ================= */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

/* ================= USER LOGIN ================= */

app.post("/api/user-login", (req, res) => {

    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.json({
            success: false,
            message: "Invalid credentials"
        });
    }

    if (user.status === "FROZEN") {
        return res.json({
            success: false,
            message: "Account frozen"
        });
    }

    const userTransactions =
        transactions.filter(t => t.username === username);

    res.json({
        success: true,
        user: {
            username: user.username,
            balance: user.balance,
            account_number: user.account_number,
            status: user.status,
            transactions: userTransactions
        }
    });
});

/* ================= ADMIN LOGIN ================= */

app.post("/api/admin-login", (req, res) => {

    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        return res.json({ success: true });
    }

    res.json({
        success: false,
        message: "Invalid admin credentials"
    });
});

/* ================= SEND MONEY ================= */

app.post("/api/send-money", (req, res) => {

    const {
        username,
        receiverAccount,
        amount,
        pin
    } = req.body;

    const sender = users.find(u => u.username === username);
    const receiver = users.find(u => u.account_number === receiverAccount);

    if (!sender || !receiver) {
        return res.json({
            success: false,
            message: "Invalid account"
        });
    }

    if (sender.pin !== pin) {
        return res.json({
            success: false,
            message: "Invalid PIN"
        });
    }

    const amt = Number(amount);

    if (amt <= 0) {
        return res.json({
            success: false,
            message: "Invalid amount"
        });
    }

    if (sender.balance < amt) {
        return res.json({
            success: false,
            message: "Insufficient balance"
        });
    }

    sender.balance -= amt;
    receiver.balance += amt;

    const txDate = new Date().toISOString().split("T")[0];

    transactions.unshift({
        username: receiver.username,
        type: "RECEIVED",
        sender: sender.username,
        receiver: receiver.username,
        amount: amt,
        date: txDate,
        status: "SUCCESS"
    });

    transactions.unshift({
        username: sender.username,
        type: "SENT",
        sender: sender.username,
        receiver: receiver.username,
        amount: amt,
        date: txDate,
        status: "SUCCESS"
    });

    const userTransactions =
        transactions.filter(t => t.username === sender.username);

    res.json({
        success: true,
        balance: sender.balance,
        transactions: userTransactions
    });
});

/* ================= BOOK APPOINTMENT ================= */

app.post("/api/book-appointment", (req, res) => {

    const { username, date, purpose } = req.body;

    const slots = [
        "10:00 AM",
        "11:30 AM",
        "01:00 PM",
        "02:30 PM",
        "04:00 PM"
    ];

    const time = slots[Math.floor(Math.random() * slots.length)];

    const appointment = {
        username,
        date,
        time,
        purpose
    };

    appointments.push(appointment);

    res.json({
        success: true,
        appointment
    });
});

/* ================= GET APPOINTMENTS ================= */

app.get("/api/appointments/:username", (req, res) => {

    const username = req.params.username;

    const data = appointments.filter(a => a.username === username);

    res.json(data);
});

/* ================= ADMIN DATA ================= */

app.get("/api/admin-data", (req, res) => {

    const frozen = users.filter(u => u.status === "FROZEN").length;

    res.json({
        success: true,
        total_users: users.length,
        total_transactions: transactions.length,
        frozen_accounts: frozen,
        users: users.map(u => ({
            username: u.username,
            account_number: u.account_number,
            balance: u.balance,
            status: u.status
        })),
        transactions
    });
});

/* ================= TOGGLE FREEZE ================= */

app.post("/api/toggle-freeze", (req, res) => {

    const { username } = req.body;

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.json({
            success: false,
            message: "User not found"
        });
    }

    user.status =
        user.status === "ACTIVE" ? "FROZEN" : "ACTIVE";

    res.json({
        success: true,
        message: "Status updated"
    });
});

/* ================= START SERVER ================= */

app.listen(PORT, () => {

    console.log("==================================");
    console.log("   eBankSphere Server Running     ");
    console.log("==================================");
    console.log(`http://localhost:${PORT}`);
    console.log("==================================");
});