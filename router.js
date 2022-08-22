const express = require('express');
const router = express.Router();
const db = require('./koneksi');
const { signUpValidation, logInValidation} = require('./validasi');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// route untuk login
router.post('/register', signUpValidation, (req, res, next) => {
    db.query(
        `SELECT * FROM m_akun WHERE LOWER(email) = LOWER(${db.escape(req.body.email)});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    message: 'Email telah digunakan!'
                });
            }else {
                // email tersedia
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).send({
                            message: err
                        });
                    }else {
                        // menghash password dan menambahkan ke database
                        db.query(
                            `INSERT INTO m_akun(email, password, role_id, is_active, created_by, updated_by) 
                            VALUES (${db.escape(req.body.email)}, ${db.escape(hash)}, 1, 1, 'reactor', 'reactor')`,
                            (err, result) => {
                                if(err) {
                                    // throw err;
                                    return res.status(400).send({
                                        message: err
                                    });
                                } return res.status(201).send({
                                    message: 'Email berhasil di daftarkan'
                                });
                            }
                        )
                    }
                })
            }
        }
    )
});

// route untuk signIn
router.post('/login', logInValidation, (req, res, next) => {
    db.query(
        `SELECT * FROM m_akun WHERE email = ${db.escape(req.body.email)};`,
        (err, result) => {
            // User tidak ditemukan
            if(err) {
                return res.status(400).send({
                    message: err
                });
            }
            if (!result.length) {
                return res.status(401).send({
                    message: 'Email atau Password Salah!'
                });
            }
            // Check password
            bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr, bResult) => {
                    // password salah
                    if(bErr) {
                        return res.status(401).send({
                            message: 'Email atau Password Salah!'
                        });
                    }
                    if(bResult) {
                        // membuat token untuk autentikasi
                        const token = jwt.sign({
                            id: result[0].id},
                            'the-super-strong-secrect',
                            {expiresIn: '1h'}
                        );
                        return res.status(400).send({
                            message: 'Logged in!',
                            token,
                            user: result[0]
                        });
                    }
                    return res.status(401).send({
                        message: 'Email atau Password Salah!'
                    });
                }
            )
        }
    )
});

// route untuk mendapat test pass jwt
router.post('/get-user', signUpValidation, (req, res, next) => {
    if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: 'Oops!! please input token'
        });
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(theToken, 'the-super-strong-secrect');
    db.query('SELECT * FROM m_akun WHERE id=?', decode.id, function (err, result, field){
        if(err) throw err;
        return res.send({
            error: false,
            data: result[0],
            message: 'Fetch Successfully'
        });
    });
});

module.exports = router;