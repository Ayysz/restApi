// import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const indexRouter = require('./router');
var env = require('dotenv').config();


// defining app from express and env
const app = express();
    env = process.env;

// defining from .env
const port = env.PORT;
const host =  env.HOST;

//menambahkan body parser untuk menangkap respon body json menjadi object JS
app.use(bodyParser.json()); 

// menambahkan body parser yang sudah encoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// memperbolehkan CORS untuk semua modul
app.use(cors());

// menambahkan morgan untuk log http
app.use(morgan('short'));

// mengambil route dari router.js
app.use('/api', indexRouter);

// handling error
app.use((err, req, res, next) => {
    // console.log(`err message : ${err.message}`);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
})

app.listen(port, () => {
    // console.log(`${Date.now()}`)
    console.log(`Server running at http://${host}:${port}`);
});
// membuat server yang berjalan di ${port} = 3000


