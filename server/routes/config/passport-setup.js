const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const db = require('../../../database/index');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  db.getUserById({ userId: id }, (err, user) => {
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
    const tokenExpiresAt = new Date(Date.now() + 60*60*1000).toISOString().slice(0, 19).replace('T', ' ');
    db.addUser({spotify_id: profile.id, spotify_display_name: profile.displayName, access_token: accessToken, refresh_token: refreshToken, token_expires_at: tokenExpiresAt, image_url: profile.photos[0]}, (err, user) => {
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