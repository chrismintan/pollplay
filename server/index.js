require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Use routes
const apiRoutes = require('./routes/api/apiRoutes');
const authRoutes = require('./routes/spotify/authRoutes');
const spotifyApiRoutes = require('./routes/spotify/apiRoutes');

// Use passport modules
const passportSetup = require('./routes/config/passport-setup');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

// Link to db queries
const db = require('../database/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Test path can delete later
app.get('/testing', db.getSongsInRoom)

// Spotify api routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/spotify', spotifyApiRoutes)

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