const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./h2o_database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    os TEXT,
    imei TEXT,
    status TEXT NOT NULL,
    until_use TEXT
  )`);

  db.run(`INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (1, 'admin', 'admin@h2o.com', 'admin123', 'Admin')`, (err) => {
    if (err) {
      console.log('User already exists or error:', err.message);
    } else {
      console.log('Admin user created successfully!');
    }
  });

  db.all('SELECT * FROM users', (err, rows) => {
    console.log('\nCurrent users in database:');
    console.log(rows);
    console.log('\nYou can now login with:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nServer should be running at: http://localhost:3000');
  });
});

db.close();
