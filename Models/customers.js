const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customers = new Schema({
    name: String,
    age: Number
})

module.exports = mongoose.model('Customers', customers)