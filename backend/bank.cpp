#include <iostream>
#include <string>
#include <vector>
#include <ctime>
#include <sstream>
#include <iomanip>
#include "sqlite3.h"

using namespace std;

/* ================= DB ================= */

sqlite3* DB;

/* ================= UTIL ================= */

string today() {
    time_t now = time(0);
    tm *ltm = localtime(&now);

    stringstream ss;
    ss << 1900 + ltm->tm_year << "-"
       << setw(2) << setfill('0') << 1 + ltm->tm_mon << "-"
       << setw(2) << setfill('0') << ltm->tm_mday;

    return ss.str();
}

string randomTimeSlot() {
    string slots[] = {
        "10:00 AM",
        "11:30 AM",
        "01:00 PM",
        "02:30 PM",
        "04:00 PM"
    };

    return slots[rand() % 5];
}

/* ================= INIT DB ================= */

void runSQL(string sql) {
    char* err;
    sqlite3_exec(DB, sql.c_str(), 0, 0, &err);
    if (err) sqlite3_free(err);
}

void initDB() {

    runSQL(
        "CREATE TABLE IF NOT EXISTS users("
        "username TEXT PRIMARY KEY,"
        "password TEXT,"
        "account TEXT,"
        "balance REAL,"
        "status TEXT,"
        "pin TEXT);"
    );

    runSQL(
        "CREATE TABLE IF NOT EXISTS transactions("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "username TEXT,"
        "type TEXT,"
        "sender TEXT,"
        "receiver TEXT,"
        "amount REAL,"
        "date TEXT,"
        "status TEXT);"
    );

    runSQL(
        "CREATE TABLE IF NOT EXISTS appointments("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "username TEXT,"
        "date TEXT,"
        "time TEXT,"
        "purpose TEXT);"
    );
}

/* ================= DEFAULT USERS ================= */

void seedUsers() {

    runSQL("DELETE FROM users;");

    runSQL(
        "INSERT INTO users VALUES"
        "('user1','1234','4382',12000,'ACTIVE','1234'),"
        "('user2','1234','5281',15000,'ACTIVE','1234'),"
        "('user3','1234','7610',18000,'ACTIVE','1234');"
    );
}

/* ================= USER FETCH ================= */

struct User {
    string username;
    string account;
    double balance;
    string status;
    string pin;
};

User getUser(string username) {

    User u;

    string sql =
        "SELECT * FROM users WHERE username='" + username + "';";

    sqlite3_stmt* stmt;

    sqlite3_prepare_v2(DB, sql.c_str(), -1, &stmt, 0);

    if (sqlite3_step(stmt) == SQLITE_ROW) {

        u.username = (char*)sqlite3_column_text(stmt, 0);
        u.account  = (char*)sqlite3_column_text(stmt, 2);
        u.balance  = sqlite3_column_double(stmt, 3);
        u.status   = (char*)sqlite3_column_text(stmt, 4);
        u.pin      = (char*)sqlite3_column_text(stmt, 5);
    }

    sqlite3_finalize(stmt);

    return u;
}

/* ================= LOGIN ================= */

bool userLogin(string u, string p) {

    string sql =
        "SELECT * FROM users WHERE username='" + u +
        "' AND password='" + p + "';";

    sqlite3_stmt* stmt;

    sqlite3_prepare_v2(DB, sql.c_str(), -1, &stmt, 0);

    bool ok = false;

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        string status = (char*)sqlite3_column_text(stmt, 4);
        ok = (status != "FROZEN");
    }

    sqlite3_finalize(stmt);

    return ok;
}

bool adminLogin(string u, string p) {
    return (u == "admin" && p == "admin123");
}

/* ================= TRANSACTIONS ================= */

void addTransaction(string u, string type, string sender, string receiver, double amount) {

    string sql =
        "INSERT INTO transactions(username,type,sender,receiver,amount,date,status)"
        "VALUES('" + u + "','" + type + "','" + sender + "','" + receiver + "',"
        + to_string(amount) + ",'" + today() + "','SUCCESS');";

    runSQL(sql);
}

/* ================= SEND MONEY ================= */

bool sendMoney(string sender, string receiverAccount, double amount, string pin) {

    User s = getUser(sender);

    if (s.pin != pin) return false;
    if (s.balance < amount) return false;

    string sqlR =
        "SELECT username FROM users WHERE account='" + receiverAccount + "';";

    sqlite3_stmt* stmt;

    sqlite3_prepare_v2(DB, sqlR.c_str(), -1, &stmt, 0);

    if (sqlite3_step(stmt) != SQLITE_ROW) {
        sqlite3_finalize(stmt);
        return false;
    }

    string receiver = (char*)sqlite3_column_text(stmt, 0);

    sqlite3_finalize(stmt);

    runSQL(
        "UPDATE users SET balance = balance - " + to_string(amount) +
        " WHERE username='" + sender + "';"
    );

    runSQL(
        "UPDATE users SET balance = balance + " + to_string(amount) +
        " WHERE username='" + receiver + "';"
    );

    addTransaction(sender, "TRANSFER", sender, receiver, amount);

    return true;
}

/* ================= APPOINTMENT ================= */

bool bookAppointment(string user, string date, string purpose) {

    string time = randomTimeSlot();

    string sql =
        "INSERT INTO appointments(username,date,time,purpose)"
        "VALUES('" + user + "','" + date + "','" + time + "','" + purpose + "');";

    runSQL(sql);

    return true;
}

/* ================= APPOINTMENTS FETCH ================= */

string getAppointments(string user) {

    string sql =
        "SELECT date,time,purpose FROM appointments WHERE username='" + user + "';";

    sqlite3_stmt* stmt;

    sqlite3_prepare_v2(DB, sql.c_str(), -1, &stmt, 0);

    string result = "[";

    bool first = true;

    while (sqlite3_step(stmt) == SQLITE_ROW) {

        if (!first) result += ",";

        result += "{";

        result += "\"date\":\"" + string((char*)sqlite3_column_text(stmt,0)) + "\",";
        result += "\"time\":\"" + string((char*)sqlite3_column_text(stmt,1)) + "\",";
        result += "\"purpose\":\"" + string((char*)sqlite3_column_text(stmt,2)) + "\"";

        result += "}";

        first = false;
    }

    result += "]";

    sqlite3_finalize(stmt);

    return result;
}

/* ================= ADMIN ================= */

string getAllUsers() {

    sqlite3_stmt* stmt;

    sqlite3_prepare_v2(DB, "SELECT username,account,balance,status FROM users;", -1, &stmt, 0);

    string r = "[";

    bool first = true;

    while (sqlite3_step(stmt) == SQLITE_ROW) {

        if (!first) r += ",";

        r += "{";

        r += "\"username\":\"" + string((char*)sqlite3_column_text(stmt,0)) + "\",";
        r += "\"account\":\"" + string((char*)sqlite3_column_text(stmt,1)) + "\",";
        r += "\"balance\":" + to_string(sqlite3_column_double(stmt,2)) + ",";
        r += "\"status\":\"" + string((char*)sqlite3_column_text(stmt,3)) + "\"";

        r += "}";

        first = false;
    }

    r += "]";

    sqlite3_finalize(stmt);

    return r;
}

string getAllTransactions() {

    sqlite3_stmt* stmt;

    sqlite3_prepare_v2(DB,
        "SELECT username,type,sender,receiver,amount,date,status FROM transactions;",
        -1, &stmt, 0);

    string r = "[";

    bool first = true;

    while (sqlite3_step(stmt) == SQLITE_ROW) {

        if (!first) r += ",";

        r += "{";

        r += "\"username\":\"" + string((char*)sqlite3_column_text(stmt,0)) + "\",";
        r += "\"type\":\"" + string((char*)sqlite3_column_text(stmt,1)) + "\",";
        r += "\"sender\":\"" + string((char*)sqlite3_column_text(stmt,2)) + "\",";
        r += "\"receiver\":\"" + string((char*)sqlite3_column_text(stmt,3)) + "\",";
        r += "\"amount\":" + to_string(sqlite3_column_double(stmt,4)) + ",";
        r += "\"date\":\"" + string((char*)sqlite3_column_text(stmt,5)) + "\",";
        r += "\"status\":\"" + string((char*)sqlite3_column_text(stmt,6)) + "\"";

        r += "}";

        first = false;
    }

    r += "]";

    sqlite3_finalize(stmt);

    return r;
}

void toggleFreeze(string username) {

    runSQL(
        "UPDATE users SET status = CASE "
        "WHEN status='ACTIVE' THEN 'FROZEN' "
        "ELSE 'ACTIVE' END "
        "WHERE username='" + username + "';"
    );
}

/* ================= MAIN (CGI STYLE PLACEHOLDER) ================= */

int main() {

    srand(time(0));

    sqlite3_open("bank.db", &DB);

    initDB();
    seedUsers();

    cout << "Content-Type: application/json\n\n";

    /* NOTE:
       In real CGI, you would parse QUERY_STRING / POST body.
       Here backend is prepared for Express integration.
    */

    cout << "{\"status\":\"bank.cpp loaded\"}";

    sqlite3_close(DB);

    return 0;
}