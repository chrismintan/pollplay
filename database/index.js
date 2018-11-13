const pg = require('pg');
const url = require('url');
require('dotenv').config();

var configs;

if ( process.env.DATABASE_URL ) {

  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  var configs = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true,
  };
} else {

  var configs = {
    user: 'chrisssy',
    host: '127.0.0.1',
    database: 'pollplay',
    port: 5432,
  }
}

const pool = new pg.Pool(configs);

pool.on('error', function(err) {
  console.log('idle client error', err.message, err.stack);
});

const addUser = (req, res) => {
  console.log(req.spotify_id)
  let text = `SELECT * FROM users WHERE spotify_id = '${req.spotify_id}'`;
  pool.query(text, (err, existingUser) => {
    if ( err ) {
      console.log('error: ', err)
      res.sendStatus(500);
    } else {
      if ( existingUser.rows == 0 ) {
        console.log(req)
        let text1 = `INSERT INTO users (spotify_id, spotify_display_name, access_token, refresh_token, token_expires_at) VALUES ($1, $2, $3, $4, $5)`;

        let values1 = [req.spotify_id, req.spotify_display_name, req.access_token, req.refresh_token, req.token_expires_at];

        pool.query(text1, values1, (err, result) => {
          if ( err ) {
            console.log('error: ', err)
            res.sendStatus(500);
          } else {
            res(null, result)
          }
        })
      } else {
        res(null, existingUser)
      }
    }
  })
}

const getAccessTokenAndExpiresAt = (req, res) => {
  let text = `SELECT * FROM users WHERE id = '${req.req}'`
  pool.query(text, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res(null, result)
    }
  })
}

const getSongsInRoom = (req, res) => {
  let text = `SELECT * FROM songs INNER JOIN songs_rooms ON songs.id = songs_rooms.song_id WHERE songs_rooms.room_id = '${req.query.roomID}'`;
  pool.query(text, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(result.rows);
    }
  })
}

const getUserBySpotifyId = (req, res) => {
  let text = `SELECT * FROM users WHERE spotify_id = '${req.spotify_id}'`;
  pool.query(text, (err, result) => {
    if ( err ) {
      res(err);
    } else {
      console.log('2')
      res(null, result.rows);
    }
  });
};

const updateAccessTokenAndExpiresAt = (req, res) => {
  let text = `UPDATE users SET access_token = '${req.access_token}', token_expires_at = '${req.token_expires_at}' WHERE id = ${req.user_id}`;
  pool.query(text, (err, result) => {
    if ( err ) {
      res(err);
    } else {
      res(null, result.rows);
    }
  })
}

module.exports = {
  addUser,
  getAccessTokenAndExpiresAt,
  getSongsInRoom,
  getUserBySpotifyId,
  updateAccessTokenAndExpiresAt,
}


























