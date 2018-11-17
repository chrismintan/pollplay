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

const addRoom = (req, res) => {
  let text = `INSERT INTO rooms (name, spotify_id) VALUES ($1, $2) RETURNING *`;

  let values = [req.roomName, req.spotifyId];

  pool.query(text, values, (err, result) => {
    if ( err ) {
      console.log('error:', err);
      res.sendStatus(500);
    } else {
      res(null, result);
    }
  })
}

const addSongToRoom = (req, res) => {
  let text = `INSERT INTO songs_rooms (track, artist, album_image, track_uri, room_code) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

  let values = [req.songObj.trackName, req.songObj.artistName, req.songObj.albumImageURL, req.songObj.trackURI, req.songObj.roomID];

  pool.query(text, values, (err, result) => {
    if ( err ) {
      console.log('error:', err);
      res(null, err);
    } else {
      res(null, result);
    }
  })
}

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
        let text1 = `INSERT INTO users (spotify_id, spotify_display_name, access_token, refresh_token, token_expires_at, image_url) VALUES ($1, $2, $3, $4, $5, $6)`;

        let values1 = [req.spotify_id, req.spotify_display_name, req.access_token, req.refresh_token, req.token_expires_at, req.image_url];

        pool.query(text1, values1, (err, result) => {
          if ( err ) {
            console.log('error: ', err)
            res.sendStatus(500);
          } else {
            res(null, result)
          }
        })
      } else {
        if ( existingUser.rows != 0 ) {
          console.log('UPDATEDDDD!')
          let text2 = `UPDATE users SET access_token = '${req.access_token}', token_expires_at = '${req.token_expires_at}', refresh_token = '${req.refresh_token}' WHERE spotify_id = '${req.spotify_id}'`;
          pool.query(text2, (err, result) => {
            if ( err ) {
              console.log('error:', err);
              res.sendStatus(500);
            } else {
              res(null, result)
            }
          })
        } else {
        res(null, existingUser)
        }
      }
    }
  })
}

const getAccessTokenAndExpiresAt = (req, res) => {
  let text = `SELECT * FROM users WHERE spotify_id = '${req.spotify_id}'`
  pool.query(text, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res(null, result)
    }
  })
}

const getRoomData = (req, res) => {
  let text = `SELECT * FROM users INNER JOIN rooms USING (spotify_id) WHERE rooms.name = '${req.room}'`;

  pool.query(text, (err, result) => {
    if ( err ) {
      res.sendStatus(500);
    } else {
      res(null, result.rows);
    }
  })
}

const getSongsInRoom = (req, res) => {
  let text = `SELECT * FROM songs_rooms WHERE room_code = '${req.roomId}'`;
  pool.query(text, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res(null, result.rows);
    }
  })
}

const getUserById = (req, res) => {
  let text = `SELECT * FROM users WHERE users.id = '${req.userId[0].id}'`;
  pool.query(text, (err, result) => {
    if ( err ) {
      console.log(err);
    } else {
      // console.log('RESULT.ROWS:', result.rows)
      res(null, result.rows);
    }
  });
};

const getUserBySpotifyId = (req, res) => {
  let text = `SELECT * FROM users WHERE spotify_id = '${req.spotify_id}'`;
  pool.query(text, (err, result) => {
    if ( err ) {
      res(err);
    } else {
      res(null, result.rows);
    }
  });
};

const updateAccessTokenAndExpiresAt = (req, res) => {
  let text = `UPDATE users SET access_token = '${req.access_token}', token_expires_at = '${req.token_expires_at}' WHERE spotify_id = ${req.spotify_id}`;
  pool.query(text, (err, result) => {
    if ( err ) {
      res(err);
    } else {
      res(null, result.rows);
    }
  })
}

const upVoteSong = (req, res) => {
  console.log('REQ:', req)
  let text = `UPDATE songs_rooms SET upvote = upvote + 1 WHERE room_code = '${req.roomID}'' AND track_uri = '${req.trackURI}' RETURNING *`;
  pool.query(text, (err, result) => {
    if ( err ) {
      res(err);
      console.log(err);
    } else {
      res(null, result.rows);
    }
  })
}

module.exports = {
  addRoom,
  addSongToRoom,
  addUser,
  getAccessTokenAndExpiresAt,
  getRoomData,
  getSongsInRoom,
  getUserById,
  getUserBySpotifyId,
  updateAccessTokenAndExpiresAt,
  upVoteSong,
}


























