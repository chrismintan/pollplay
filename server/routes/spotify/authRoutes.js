const router = require('express').Router();
const passport = require('passport');
const cookieSession = require('cookie-session');

const scope = [
  'user-read-email',
  'streaming',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-library-read',
  'playlist-read-private',
  'user-library-modify',
  'playlist-modify-public',
  'user-read-recently-played',
  'user-read-private',
  'playlist-modify-private',
  'user-top-read',
  'user-read-birthdate',
];

// Auth logout
router.get('/logout', (req, res) => {
  req.logout();
  req.session.userId = null;
  res.redirect('/');
});

// Auth with Spotify
router.get('/login', passport.authenticate('spotify', {
  scope,
  showDialog: true
}));

router.get('/spotify/redirect', passport.authenticate('spotify', {failureRedirect: '/login'}), (req, res) => {
  res.redirect('/');
});

// router.post('/login', passport.authenticate('local', {failureRedirect: 'login'}), (req, res) => {
//   console.log('HEREEE!!')
//   req.session.key = req.session.passport.user[0].id
// })

router.get('/isLoggedIn', (req, res) => {

  if ( typeof req.session.passport != "undefined" ) {

    let access_token = req.session.passport.user[0].access_token;
    let refresh_token = req.session.passport.user[0].refresh_token;
    let spotify_id = req.session.passport.user[0].spotify_id;
    let userId = req.session.passport.user[0].id;
    let display_name = req.session.passport.user[0].spotify_display_name;
    let image_url = req.session.passport.user[0].image_url

    res.send( { access_token: access_token, refresh_token: refresh_token, spotify_id: spotify_id, userId: userId, display_name: display_name, image_url: image_url } || null);

  } else {
    res.send( spotify_id == null )
  }


});

module.exports = router;