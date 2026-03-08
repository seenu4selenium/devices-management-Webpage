const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static('.'));

// Create SQLite database
const db = new sqlite3.Database('h2o_database.db');

// Initialize tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        os TEXT NOT NULL,
        imei TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL,
        until_use TEXT
    )`);
    
    // Insert default users
    db.run("INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", 
           ['admin', 'admin@h2o.com', 'admin123', 'Admin']);
    db.run("INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", 
           ['test', 'test@h2o.com', 'test', 'Normal User']);
});

// API Routes
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE name = ? AND password = ?", [username, password], (err, row) => {
        if (row) {
            res.json({ success: true, user: row });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.post('/api/signup', (req, res) => {
    const { name, email, password, role } = req.body;
    db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", 
           [name, email, password, role], function(err) {
        if (err) {
            res.json({ success: false, message: 'Registration failed' });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/api/users', (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
        res.json(rows || []);
    });
});

app.post('/api/addDevice', (req, res) => {
    const { name, type, os, imei, status, until_use } = req.body;
    db.run("INSERT INTO devices (name, type, os, imei, status, until_use) VALUES (?, ?, ?, ?, ?, ?)", 
           [name, type, os, imei, status, until_use], function(err) {
        if (err) {
            res.json({ success: false, message: 'Device add failed' });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/api/devices', (req, res) => {
    db.all("SELECT * FROM devices", (err, rows) => {
        res.json(rows || []);
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});