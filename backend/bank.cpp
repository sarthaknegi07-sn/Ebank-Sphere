#include <bits/stdc++.h>
#include "sqlite3.h"
using namespace std;

// ---------------- INIT DATABASE ----------------
void init(sqlite3 *db)
{
    char *err;

    // USERS
    sqlite3_exec(db,
        "CREATE TABLE IF NOT EXISTS users("
        "username TEXT PRIMARY KEY,"
        "password TEXT);",
        0, 0, &err);

    // TRANSACTIONS
    sqlite3_exec(db,
        "CREATE TABLE IF NOT EXISTS transactions("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "username TEXT,"
        "receiver TEXT,"
        "amount INTEGER,"
        "date TEXT,"
        "time TEXT);",
        0, 0, &err);

    // LOANS
    sqlite3_exec(db,
        "CREATE TABLE IF NOT EXISTS loans("
        "username TEXT,"
        "credit_score INTEGER);",
        0, 0, &err);

    // APPOINTMENTS
    sqlite3_exec(db,
        "CREATE TABLE IF NOT EXISTS appointments("
        "name TEXT,"
        "age INTEGER,"
        "date TEXT,"
        "time TEXT,"
        "counter INTEGER);",
        0, 0, &err);

    // INSERT USERS
    sqlite3_exec(db,
        "INSERT OR IGNORE INTO users VALUES"
        "('user1','1234'),"
        "('user2','1234'),"
        "('user3','1234');",
        0, 0, &err);

    // INSERT TRANSACTIONS
    sqlite3_exec(db,
        "INSERT INTO transactions(username,receiver,amount,date,time) VALUES"
        "('user1','Rahul',500,'2026-03-01','10:00'),"
        "('user1','Amit',700,'2026-03-02','12:00'),"
        "('user2','Sita',900,'2026-03-03','14:00'),"
        "('user3','Ramesh',300,'2026-03-04','16:00');",
        0, 0, &err);
}

// ---------------- LOGIN ----------------
bool login(sqlite3 *db, string user, string pass)
{
    string query = "SELECT * FROM users WHERE username='" + user + "' AND password='" + pass + "';";
    sqlite3_stmt *stmt;

    sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, 0);

    bool success = false;
    if (sqlite3_step(stmt) == SQLITE_ROW)
        success = true;

    sqlite3_finalize(stmt);
    return success;
}

// ---------------- VIEW TRANSACTIONS ----------------
int callback(void *NotUsed, int argc, char **argv, char **azColName)
{
    for (int i = 0; i < argc; i++)
        cout << argv[i] << " ";
    cout << endl;
    return 0;
}

void showTransactions(sqlite3 *db, string user)
{
    string query = "SELECT receiver,amount,date,time FROM transactions WHERE username='" + user + "';";
    char *err;
    sqlite3_exec(db, query.c_str(), callback, 0, &err);
}

// ---------------- CREDIT SCORE ----------------
int creditScore(sqlite3 *db, string user)
{
    string query = "SELECT SUM(amount) FROM transactions WHERE username='" + user + "';";
    sqlite3_stmt *stmt;

    sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, 0);

    int total = 0;
    if (sqlite3_step(stmt) == SQLITE_ROW)
        total = sqlite3_column_int(stmt, 0);

    sqlite3_finalize(stmt);

    // Simple formula
    return total / 10;
}

// ---------------- APPOINTMENT (Priority Queue) ----------------
struct Person
{
    string name;
    int age;
    string date;

    bool operator<(const Person &other) const
    {
        return age < other.age; // older = higher priority
    }
};

void bookAppointment(sqlite3 *db, string name, int age, string date)
{
    priority_queue<Person> pq;

    pq.push({name, age, date});

    Person p = pq.top();

    int counter = rand() % 5 + 1;
    string time = "10:00";

    string query = "INSERT INTO appointments VALUES('" +
                   p.name + "'," +
                   to_string(p.age) + ",'" +
                   p.date + "','" +
                   time + "'," +
                   to_string(counter) + ");";

    char *err;
    sqlite3_exec(db, query.c_str(), 0, 0, &err);

    cout << "APPOINTMENT_BOOKED";
}

// ---------------- MAIN ----------------
int main(int argc, char *argv[])
{
    sqlite3 *db;

    // IMPORTANT PATH
    if (sqlite3_open("../bank.db", &db))
    {
        cout << "DB_ERROR";
        return 0;
    }

    init(db);

    string action = argv[1];

    // LOGIN
    if (action == "login")
    {
        string user = argv[2];
        string pass = argv[3];

        if (login(db, user, pass))
            cout << "SUCCESS";
        else
            cout << "FAIL";
    }

    // TRANSACTIONS
    else if (action == "transactions")
    {
        string user = argv[2];
        showTransactions(db, user);
    }

    // LOAN
    else if (action == "loan")
    {
        string user = argv[2];
        int score = creditScore(db, user);
        cout << "CREDIT_SCORE " << score;
    }

    // APPOINTMENT
    else if (action == "appointment")
    {
        string name = argv[2];
        int age = stoi(argv[3]);
        string date = argv[4];

        bookAppointment(db, name, age, date);
    }

    sqlite3_close(db);
    return 0;
}