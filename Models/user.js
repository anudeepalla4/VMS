const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    gender: {
       type: Number,
       required: true
    },
    mobileNumber: {
       type: Number,
       required: true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
 });

 module.exports = mongoose.model('User', userSchema)