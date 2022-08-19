const { check } = require('express-validator');

exports.signUpValidation = [
    check('email', 'masukan email yang valid')
        .isEmail()
        .normalizeEmail({
            gmail_remove_dots: true
        })
        .not()
        .isEmpty(),
    check('password', 'Password harus lebih dari 6 karakter').isLength({min: 6})
];

exports.logInValidation = [
    check('email', 'masukan email yang valid')
        .isEmail()
        .normalizeEmail({
            gmail_remove_dots: true
        })
        .not()
        .isEmpty(),
    check('password', 'Password harus lebih dari 6 karakter').isLength({min: 6})
];
