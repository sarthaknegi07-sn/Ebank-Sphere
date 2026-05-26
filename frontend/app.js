const roleSection =
document.getElementById("roleSection");

const userLoginSection =
document.getElementById("userLoginSection");

const adminLoginSection =
document.getElementById("adminLoginSection");

const userDashboard =
document.getElementById("userDashboard");

const adminDashboard =
document.getElementById("adminDashboard");

const topLogoutBtn =
document.getElementById("topLogoutBtn");

const myAppointmentBtn =
document.getElementById("myAppointmentBtn");

const appointmentListCard =
document.getElementById("appointmentListCard");

const appointmentTable =
document.getElementById("appointmentTable");

const notificationBox =
document.getElementById("notificationBox");

const notificationText =
document.getElementById("notificationText");

const loaderWrapper =
document.getElementById("loaderWrapper");

const welcomeUser =
document.getElementById("welcomeUser");

const userBalance =
document.getElementById("userBalance");

const accountNumber =
document.getElementById("accountNumber");

const accountStatus =
document.getElementById("accountStatus");

const transactionTable =
document.getElementById("transactionTable");

const adminUsersTable =
document.getElementById("adminUsersTable");

const adminTransactionTable =
document.getElementById("adminTransactionTable");

const totalUsers =
document.getElementById("totalUsers");

const totalTransactions =
document.getElementById("totalTransactions");

const frozenAccounts =
document.getElementById("frozenAccounts");

const searchUser =
document.getElementById("searchUser");

const transactionSearch =
document.getElementById("transactionSearch");

let loggedInUser = null;

/* ================= NOTIFICATION ================= */

function showNotification(message){

    notificationText.innerText = message;

    notificationBox.classList.remove("hidden");

    setTimeout(() => {

        notificationBox.classList.add("hidden");

    }, 2500);
}

/* ================= LOADER ================= */

function showLoader(){
    loaderWrapper.classList.remove("hidden");
}

function hideLoader(){
    loaderWrapper.classList.add("hidden");
}

/* ================= NAVIGATION ================= */

document.getElementById("showUserLogin")
.addEventListener("click", () => {

    roleSection.classList.add("hidden");
    userLoginSection.classList.remove("hidden");
});

document.getElementById("showAdminLogin")
.addEventListener("click", () => {

    roleSection.classList.add("hidden");
    adminLoginSection.classList.remove("hidden");
});

document.getElementById("backFromUser")
.addEventListener("click", () => {

    userLoginSection.classList.add("hidden");
    roleSection.classList.remove("hidden");
});

document.getElementById("backFromAdmin")
.addEventListener("click", () => {

    adminLoginSection.classList.add("hidden");
    roleSection.classList.remove("hidden");
});

/* ================= USER LOGIN ================= */

document.getElementById("userLoginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username =
    document.getElementById("userUsername").value;

    const password =
    document.getElementById("userPassword").value;

    showLoader();

    try{

        const res =
        await fetch("/api/user-login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                password
            })
        });

        const data = await res.json();

        hideLoader();

        if(data.success){

            loggedInUser = data.user;

            loadUser(data.user);

            userLoginSection.classList.add("hidden");
            userDashboard.classList.remove("hidden");

            topLogoutBtn.classList.remove("hidden");
            myAppointmentBtn.classList.remove("hidden");

            document.getElementById("userLoginForm").reset();

            showNotification("Login successful");

        }else{

            showNotification(data.message);
        }

    }catch(err){

        hideLoader();
        showNotification("Server connection failed");
    }
});

/* ================= ADMIN LOGIN ================= */

document.getElementById("adminLoginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username =
    document.getElementById("adminUsername").value;

    const password =
    document.getElementById("adminPassword").value;

    showLoader();

    try{

        const res =
        await fetch("/api/admin-login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                password
            })
        });

        const data = await res.json();

        hideLoader();

        if(data.success){

            loadAdmin();

            adminLoginSection.classList.add("hidden");
            adminDashboard.classList.remove("hidden");

            topLogoutBtn.classList.remove("hidden");

            document.getElementById("adminLoginForm").reset();

            showNotification("Admin login successful");

        }else{

            showNotification(data.message);
        }

    }catch(err){

        hideLoader();
        showNotification("Server error");
    }
});

/* ================= USER DASHBOARD ================= */

function loadUser(user){

    welcomeUser.innerText = user.username;
    userBalance.innerText = "₹" + user.balance;
    accountNumber.innerText = user.account_number;
    accountStatus.innerText = user.status;

    renderTransactions(user.transactions || []);
}

function renderTransactions(list){

    transactionTable.innerHTML = "";

    list.forEach(t => {

        const row =
        document.createElement("tr");

        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.type}</td>
            <td>${t.sender}</td>
            <td>${t.receiver}</td>
            <td>₹${t.amount}</td>
        `;

        transactionTable.appendChild(row);
    });
}

/* ================= SEND MONEY ================= */

document.getElementById("transactionForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const receiverAccount =
    document.getElementById("receiverAccount").value;

    const amount =
    document.getElementById("sendAmount").value;

    const pin =
    document.getElementById("transactionPin").value;

    showLoader();

    try{

        const res =
        await fetch("/api/send-money",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username:loggedInUser.username,
                receiverAccount,
                amount,
                pin
            })
        });

        const data = await res.json();

        hideLoader();

        if(data.success){

            userBalance.innerText =
            "₹" + data.balance;

            renderTransactions(data.transactions);

            document.getElementById("transactionForm").reset();

            showNotification("Money sent successfully");

        }else{

            showNotification(data.message);
        }

    }catch(err){

        hideLoader();
        showNotification("Transaction failed");
    }
});

/* ================= APPOINTMENT BOOKING ================= */

document.getElementById("appointmentForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const date =
    document.getElementById("appointmentDate").value;

    const purpose =
    document.getElementById("appointmentPurpose").value;

    showLoader();

    try{

        const res =
        await fetch("/api/book-appointment",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username:loggedInUser.username,
                date,
                purpose
            })
        });

        const data = await res.json();

        hideLoader();

        if(data.success){

            const a = data.appointment;

            document.getElementById("appointmentResult")
            .innerHTML =
            `Appointment Confirmed: ${a.date} at ${a.time}`;

            document.getElementById("appointmentForm").reset();

            showNotification("Appointment booked");

        }else{

            showNotification("Booking failed");
        }

    }catch(err){

        hideLoader();
        showNotification("Server error");
    }
});

/* ================= MY APPOINTMENTS ================= */

myAppointmentBtn.addEventListener("click", async () => {

    showLoader();

    try{

        const res =
        await fetch(
            `/api/appointments/${loggedInUser.username}`
        );

        const data = await res.json();

        hideLoader();

        appointmentListCard.classList.remove("hidden");

        appointmentTable.innerHTML = "";

        data.forEach(app => {

            const row =
            document.createElement("tr");

            row.innerHTML = `
                <td>${app.date}</td>
                <td>${app.time}</td>
                <td>${app.purpose}</td>
            `;

            appointmentTable.appendChild(row);
        });

    }catch(err){

        hideLoader();
        showNotification("Failed to load appointments");
    }
});

/* ================= ADMIN ================= */

function loadAdmin(){

    fetch("/api/admin-data")
    .then(res => res.json())
    .then(data => {

        totalUsers.innerText = data.total_users;
        totalTransactions.innerText = data.total_transactions;
        frozenAccounts.innerText = data.frozen_accounts;

        renderAdminUsers(data.users);
        renderAdminTransactions(data.transactions);
    });
}

function renderAdminUsers(users){

    adminUsersTable.innerHTML = "";

    users.forEach(u => {

        const row =
        document.createElement("tr");

        row.innerHTML = `
            <td>${u.username}</td>
            <td>${u.account_number}</td>
            <td>₹${u.balance}</td>
            <td>${u.status}</td>
            <td>
                <button onclick="toggleFreeze('${u.username}')">
                    ${u.status === "ACTIVE" ? "Freeze" : "Unfreeze"}
                </button>
            </td>
        `;

        adminUsersTable.appendChild(row);
    });
}

function renderAdminTransactions(list){

    adminTransactionTable.innerHTML = "";

    list.forEach(t => {

        const row =
        document.createElement("tr");

        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.username}</td>
            <td>${t.type}</td>
            <td>₹${t.amount}</td>
            <td>${t.status}</td>
        `;

        adminTransactionTable.appendChild(row);
    });
}

/* ================= SEARCH ================= */

searchUser.addEventListener("keyup", () => {

    const val = searchUser.value.toLowerCase();

    [...adminUsersTable.children].forEach(row => {

        const name =
        row.children[0].innerText.toLowerCase();

        row.style.display =
        name.includes(val) ? "" : "none";
    });
});

transactionSearch.addEventListener("keyup", () => {

    const val = transactionSearch.value.toLowerCase();

    [...adminTransactionTable.children].forEach(row => {

        const name =
        row.children[1].innerText.toLowerCase();

        row.style.display =
        name.includes(val) ? "" : "none";
    });
});

/* ================= FREEZE ================= */

async function toggleFreeze(username){

    await fetch("/api/toggle-freeze",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({username})
    });

    loadAdmin();
}

/* ================= LOGOUT ================= */

topLogoutBtn.addEventListener("click", () => {

    loggedInUser = null;

    userDashboard.classList.add("hidden");
    adminDashboard.classList.add("hidden");

    appointmentListCard.classList.add("hidden");
    appointmentTable.innerHTML = "";
    document.getElementById("appointmentResult").innerHTML = "";

    roleSection.classList.remove("hidden");

    topLogoutBtn.classList.add("hidden");
    myAppointmentBtn.classList.add("hidden");

    showNotification("Logged out");
});