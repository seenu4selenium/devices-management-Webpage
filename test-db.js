const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'h2o_device_management',
            port: 3306
        });
        
        console.log('Database connected successfully!');
        
        const [rows] = await connection.execute('SELECT * FROM users');
        console.log('Users found:', rows.length);
        console.log('Users:', rows);
        
        await connection.end();
    } catch (error) {
        console.error('Connection failed:', error.message);
    }
}

testConnection();