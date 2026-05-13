const express = require('express');
const Database = require('better-sqlite3');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});
app.use(express.static('.'));

const db = new Database('h2o_database.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        os TEXT NOT NULL,
        imei TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL,
        until_use TEXT
    );
`);

// Insert default users
const insertUser = db.prepare('INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
insertUser.run('admin', 'admin@h2o.com', 'admin123', 'Admin');
insertUser.run('test', 'test@h2o.com', 'test', 'Normal User');

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE name = ? AND password = ?').get(username, password);
    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/signup', (req, res) => {
    const { name, email, password, role } = req.body;
    const existing = db.prepare('SELECT id FROM users WHERE name = ? OR email = ?').get(name, email);
    if (existing) {
        return res.json({ success: false, message: 'User already exists with that name or email.' });
    }
    try {
        db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email, password, role);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: 'Registration failed' });
    }
});

app.get('/api/users', (req, res) => {
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
});

app.delete('/api/users/:id', (req, res) => {
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

app.put('/api/users/:id', (req, res) => {
    const { name, email, password, role } = req.body;
    db.prepare('UPDATE users SET name=?, email=?, password=?, role=? WHERE id=?').run(name, email, password, role, req.params.id);
    res.json({ success: true });
});

app.post('/api/addDevice', (req, res) => {
    const { name, type, os, imei, status, until_use } = req.body;
    try {
        db.prepare('INSERT INTO devices (name, type, os, imei, status, until_use) VALUES (?, ?, ?, ?, ?, ?)').run(name, type, os, imei, status, until_use);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: 'Device add failed' });
    }
});

app.get('/api/devices', (req, res) => {
    const devices = db.prepare('SELECT * FROM devices').all();
    res.json(devices);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
