require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Use routes
const apiRoutes = require('./routes/api/apiRoutes');
const authRoutes = require('./routes/spotify/authRoutes');
const spotifyApiRoutes = require('./routes/spotify/apiRoutes');

// Cookies
const cookieSession = require('cookie-session');

// Use passport modules
const passportSetup = require('./routes/config/passport-setup');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

// Link to db queries
const db = require('../database/index');

const app = express();

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.use(cookieSession({
  name: 'session',
  keys: ['userId', 'spotify_id']
}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 1000 * 60 * 60 * 24, //Set for one day
  }
}));

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



// Test path can delete later
app.get('/testing', db.getSongsInRoom)

// Spotify api routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/spotify', spotifyApiRoutes)

app.use(express.static(__dirname + '/../client/dist'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});



const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Tuning into the sweet waves of PORT: ${port}`)
})

const io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {
  console.log('Connected!')

  // Clunky room implementation but works!
  socket.on('room', (room, data) => {
    socket.join(room);

    socket.on(room, function(data) {
      io.in(room).emit('message', data)
    })
  })

})






