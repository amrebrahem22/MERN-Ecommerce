const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

// APP
const app = express();

// DB
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DATABASE Connected Successfully.'))
.catch(error => console.log(`DATABASE CONNECTION ERROR: ${error}`))

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '2mb'}));
app.use(cors());

// Route
fs.readdirSync('./routes').map(r => app.use('/api', require('./routes/' + r)));

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is Running on port ${port}`));