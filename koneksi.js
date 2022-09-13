const mysql = require('mysql');
var env = require('dotenv').config();
    env = process.env;

// defining from .env
const db_host = env.DATABASE_HOST;
const db_user = env.DATABASE_USER;
const db_name = env.DATABASE_NAME;
const db_pw = env.DATABASE_PASSWORD;

// membuat koneksi mysql
const conn = mysql.createConnection({
    host: db_host,
    user: db_user,
    password: db_pw,
    database: db_name,
});

// cek koneksi
conn.connect((err) => {
    if(err)  throw err;
    console.log('Mysql connected successfully!');
})

module.exports = conn;
