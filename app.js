const express = require('express');
const PORT = process.env.PORT || 8080
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./Routes/auth');

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message, data: error.data })
})

mongoose.connect('mongodb://localhost:27017/vms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    app.listen(8000);
    console.log('connected')
}).catch(err => {
    console.log(err.message)
})