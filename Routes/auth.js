const express = require('express');
const { body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../Models/user');

const router = express.Router();

router.post('/signup', [
    body('email').isEmail().withMessage('Please Enter valid email').custom((value, {req}) =>{
        return User.findOne({email: value}).then(userDoc => {
            if(userDoc) {
                return Promise.reject('Email alredy exists')
            }
        })
    }),
    body('name').trim().not().isEmpty(),
    body('gender').isNumeric(),
    body('mobileNumber').trim().isLength({min: 10, max: 10}),
    body('password').isLength({min: 6})
], authController.signUp);

router.post('/login',[
    body('email').isEmail().withMessage("Enter Valid Email")
], authController.login);

router.post('/forgotPassword', [
    body('email').isEmail().withMessage("Enter valid email")
], authController.forgotPassword)

router.post('/updatePassword', authController.updatePassword)
module.exports = router