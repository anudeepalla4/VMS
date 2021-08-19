const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validition Failed ');
        error.statusCode = 422;
        error.data = errors.array()
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const mobileNumber = req.body.mobileNumber;
    const gender = req.body.gender

    bcrypt.hash(password, 12).then(hasPass => {
        const user = new User({
            email: email,
            password: hasPass,
            name: name,
            mobileNumber: mobileNumber,
            gender: gender
        });
        return user.save()

    }).then(result => {
        res.status(200).json({ message: 'user Created', userId: result._id })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.login = ((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validition Failed');
        error.statusCode = 422;
        error.data = errors.array()
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    User.findOne({ email: email }).then(user => {
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 422
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password)
    }).then(isEqual => {
        if (!isEqual) {
            const error = new Error('Password Wrong');
            error.statusCode = 422
            throw error;
        }
        const token = jwt.sign({ email: loadedUser.email, userId: loadedUser._id.toString() }, 'someSuperscretkey', { expiresIn: '1h' });
        res.status(200).json({ token: token, userId: loadedUser._id.toString() })

    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
})

exports.forgotPassword = ((req, res, next) => {

    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        const error = new Error('Validition Failed');
        error.statusCode = 402;
        error.data = errors.array()
        throw error;
    }
    const email = req.body.email;

    User.findOne({ email: email }).then(user => {
        if (!user) {
            const error = new Error("Invalid Email Id");
            error.statusCode = 422;
            throw error
        }
        res.status(200).json({ data: true, email: user.email })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
})

exports.updatePassword = ((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("validation Failed")
        error.statusCode = 422;
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 12).then(hasPass => {
        User.updateOne({ email: email }, { $set: { password: hasPass } }).then(result => {
            res.status(200).json({ data: result })
        })
    });

})