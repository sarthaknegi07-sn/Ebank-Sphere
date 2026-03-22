let currentUser = "";

/* LOGIN */
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log("Sending:", username, password); // DEBUG

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response:", data);

        if (data.success) {
            localStorage.setItem("user", username);
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid login");
        }
    });
}

/* LOAD DASHBOARD */
function loadDashboard() {
    currentUser = localStorage.getItem("user");
    document.getElementById("welcome").innerText = "Welcome " + currentUser;

    loadTransactions();
}

/* TRANSACTIONS */
let transactions = [
    {name: "Rahul", amount: 2000, date: "2026-03-20", time: "10:30"},
    {name: "Amit", amount: 5000, date: "2026-03-21", time: "12:00"},
    {name: "Neha", amount: 1500, date: "2026-03-22", time: "09:15"}
];

function loadTransactions() {
    let table = document.getElementById("txnTable");
    table.innerHTML = "";

    transactions.forEach(t => {
        table.innerHTML += `
        <tr>
            <td>${t.name}</td>
            <td>${t.amount}</td>
            <td>${t.date}</td>
            <td>${t.time}</td>
        </tr>`;
    });
}

/* SEARCH */
function searchTxn() {
    let key = document.getElementById("search").value.toLowerCase();
    let filtered = transactions.filter(t => t.name.toLowerCase().includes(key));

    let table = document.getElementById("txnTable");
    table.innerHTML = "";

    filtered.forEach(t => {
        table.innerHTML += `
        <tr>
            <td>${t.name}</td>
            <td>${t.amount}</td>
            <td>${t.date}</td>
            <td>${t.time}</td>
        </tr>`;
    });
}

/* SORT (DSA: Sorting) */
function sortBy(field) {
    transactions.sort((a, b) => {
        if (field === "amount") return a.amount - b.amount;
        return a[field].localeCompare(b[field]);
    });
    loadTransactions();
}

/* CREDIT SCORE (DSA Logic) */
function calculateScore() {
    let total = transactions.reduce((sum, t) => sum + t.amount, 0);
    let score = Math.min(900, Math.floor(total / 10));

    document.getElementById("score").innerText = "Credit Score: " + score;
    document.getElementById("loan").innerText = "Eligible Loan: ₹" + (score * 100);
}

/* PRIORITY QUEUE (Appointment) */
let appointments = [];

function bookAppointment() {
    let name = document.getElementById("name").value;
    let age = parseInt(document.getElementById("age").value);
    let date = document.getElementById("date").value;

    appointments.push({name, age, date});

    // Priority Queue (older first)
    appointments.sort((a, b) => b.age - a.age);

    let result = document.getElementById("appointmentResult");
    result.innerHTML = "";

    appointments.forEach((a, i) => {
        result.innerHTML += `<p>${a.name} - Age: ${a.age} - Priority #${i+1}</p>`;
    });
}