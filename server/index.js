require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./routes/spotify/apiRoutes');
const authRoutes = require('./routes/spotify/authRoutes');
const db = require('../database/index');
const router = require('express').Router();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/testing', db.getSongInRoom)

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

app.use(express.static(__dirname + '/../client/dist'));

// app.get('/*', (req, res) => {
//   console.log(req.url);
//   // res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//   res.render(__dirname, '../client/src/index.jsx')
// });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});