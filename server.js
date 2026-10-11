const http = require('http');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./h2o_database.db');

const server = http.createServer((req, res) => {
  // Handle API routes
  if (req.url.startsWith('/api/')) {
    handleAPI(req, res);
    return;
  }
  
  let filePath = '.' + (req.url === '/' ? '/index.html' : req.url);
  const extname = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
  };
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentTypes[extname] || 'text/plain' });
      res.end(content);
    }
  });
});

function handleAPI(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const data = body ? JSON.parse(body) : {};
    
    if (req.url === '/api/login') {
      db.get('SELECT * FROM users WHERE name = ? AND password = ?', [data.username, data.password], (err, user) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: !!user, user }));
      });
    } else if (req.url === '/api/signup') {
      db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
        [data.name, data.email, data.password, data.role], function(err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: !err, message: err ? err.message : 'Success' }));
      });
    } else if (req.url === '/api/users') {
      db.all('SELECT * FROM users', (err, rows) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows || []));
      });
    } else if (req.url === '/api/devices') {
      db.all('SELECT * FROM devices', (err, rows) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows || []));
      });
    } else if (req.url === '/api/addDevice') {
      db.run('INSERT INTO devices (name, type, os, imei, status, until_use) VALUES (?, ?, ?, ?, ?, ?)',
        [data.name, data.type, data.os, data.imei, data.status, data.until_use], function(err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: !err, message: err ? err.message : 'Success' }));
      });
    } else if (req.url === '/api/updateDevice') {
      db.run('UPDATE devices SET name=?, type=?, os=?, imei=?, status=?, until_use=? WHERE id=?',
        [data.name, data.type, data.os, data.imei, data.status, data.until_use, data.id], function(err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: !err, message: err ? err.message : 'Success' }));
      });
    } else if (req.url === '/api/deleteDevice') {
      db.run('DELETE FROM devices WHERE id = ?', [data.id], function(err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: !err, message: err ? err.message : 'Success' }));
      });
    } else {
      res.writeHead(404);
      res.end('API not found');
    }
  });
}

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('Username: admin');
  console.log('Password: admin123');
});
