const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const db = require('../../../database/index');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  db.getUserById(id, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      done(null, user);
    }
  });
});

passport.use(
  new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: '/auth/spotify/redirect'
  }, (accessToken, refreshToken, expires_in, profile, done) => {
    console.log(expires_in)
    const tokenExpiresAt = new Date(Date.now() + 60*60*1000).toISOString().slice(0, 19).replace('T', ' ');
    console.log('STORING TOKEN EXPIRES AT: ', tokenExpiresAt);
    db.addUser({spotify_id: profile.id, spotify_display_name: profile.displayName, access_token: accessToken, refresh_token: refreshToken, token_expires_at: tokenExpiresAt}, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        db.getUserBySpotifyId({spotify_id: profile.id}, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            done(null, user);
          }
        });
      }
    });
  })
);