const express = require('express');
const router = express.Router();
const db = require('../../../database/index');
const axios = require('axios');
const btoa = require('btoa');

const accessToken = async (req, res, next) => {
  db.getAccessTokenAndExpiresAt({ spotify_id: req.session.passport.user[0].spotify_id }, (err, result) => {
    if ( err ) {
      console.log(err);
      res.sendStatus(500);
    } else {
      curAccessToken = result.rows[0].access_token;
      newAccessToken = undefined;
      spotify_id = result.rows[0].spotify_id;
      next();
    }
  })
}

const getNewAccessToken = async (req, res, next) => {
  db.getAccessTokenAndExpiresAt({ spotify_id: req.session.passport.user[0].spotify_id }, async (err, result) => {
    if ( err ) {
      console.log(err);
      res.sendStatus(500);
    } else {
      expiration = Date.parse(result.rows[0].token_expires_at);
      str = new Date().toUTCString();
      currentTime = Date.parse(str.split('GMT')[0]);
      if ( currentTime >= expiration ) {
        const refreshToken = result.rows[0].refresh_token;
        const dataString = `?grant_type=refresh_token&refresh_token=${refreshToken}`;
        const encoded = btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`);
        const options = {
          method: 'POST',
          url: `https://accounts.spotify.com/api/token${dataString}`,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${encoded}`,
          },
        };

        try {
          await axios(options)
            .then(({data: {access_token}}) => {
              tokenExpiresAt = new Date(Date.now() + 60*60*1000).toISOString().slice(0, 19).replace('T', ' ');
              newAccessToken = access_token;
              curAccessToken = newAccessToken;
            });
        } catch(err) {
          console.log(err);
          res.send(500)
        }
      }

      next();
    }
  })
}

const updateAccessToken = async (req, res, next) => {
  if (newAccessToken != undefined) {
    db.updateAccessTokenAndExpiresAt( { access_token: newAccessToken,token_expires_at: tokenExpiresAt, spotify_id: req.session.passport.user[0].spotify_id }, async (err, result) => {
      if ( err ) {
        console.log(err);
        res.sendStatus(500);
      }
    });
  }
  next()
}

router.use(accessToken, getNewAccessToken, updateAccessToken);

router.get('/rooms/:roomId', (req, res) => {
  db.getRoomData({ room: req.query.query }, (err, result) => {
    if ( err ) {
      console.log(err);
    } else {
      res.json(result)
    }
  })
})

router.get('/search', (req, res) => {
  const query = req.query.query;
  // db.getUserByRoomId(req.session.roomId, (err, data) => {
  //   if (err) {
  //     console.log('we messed up our getting user:', err)
  //     res.sendStatus(500)
  //   } else {
  //     const [user] = data;
  //     let accessToken = user.access_token;

  //     axios.get('https://api.spotify.com/v1/search', {
  //       headers: {
  //         Authorization: `Bearer ${curAccessToken}`
  //       },
  //       params: {
  //         q: query,
  //         type: "track",
  //         limit: 10
  //       }
  //     })
  //     .then(({data: {tracks}}) => {
  //       res.json(tracks);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.sendStatus(500);
  //     });
  //   }
  // })
  axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${curAccessToken}`
    },
    params: {
      q: query,
      type: "track",
      limit: 10
    }
  })
  .then(({data: {tracks}}) => {
    res.json(tracks);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  });
});

router.get('/searchArtists', (req, res) => {
  const query = req.query.query;
  // db.getUserByRoomId(req.session.roomId, (err, data) => {
  //   if (err) {
  //     console.log('we messed up our getting user:', err)
  //     res.sendStatus(500)
  //   } else {
  //     const [user] = data;
  //     let accessToken = user.access_token;

  //     axios.get('https://api.spotify.com/v1/search', {
  //       headers: {
  //         Authorization: `Bearer ${curAccessToken}`
  //       },
  //       params: {
  //         q: query,
  //         type: "track",
  //         limit: 10
  //       }
  //     })
  //     .then(({data: {tracks}}) => {
  //       res.json(tracks);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.sendStatus(500);
  //     });
  //   }
  // })
  axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${curAccessToken}`
    },
    params: {
      q: query,
      type: "artist",
      limit: 10
    }
  })
  .then(({data: {tracks}}) => {
    res.json(tracks);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  });
});

router.get('/currentSong', async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player',
    headers: {
      Authorization: `Bearer ${curAccessToken}`
    }
  };

  try {
    const {data} = await axios(options);
    if ( typeof data === 'object' ) {
      res.json({
        timeUntilNextSong: data.item.duration_ms - data.progress_ms,
        isPlaying: data.is_playing,
        songData: {
          title: data.item.name,
          artist: data.item.artists[0].name,
          image: data.item.album.images[1].url
        }
      });
    }
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
})

router.post('/playNextSong', (req, res) => {
  const options = {
    method: 'POST',
    url: 'https://api.spotify.com/v1/me/player/next',
    headers: {
      Authorization: `Bearer ${curAccessToken}`
    }
  };

  try {
    axios(options);
    res.json({worked: 'Success!'});
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/initPlaylist', (req, res) => {
  fetch(`https://api.spotify.com/v1/users/${spotify_id}/playlists`, {
    headers: {
      'Authorization': `Bearer ${curAccessToken}`
    },
    contentType: 'application/json',
    method: 'POST',
    body: JSON.stringify({
      "name": `PollPlay Playlist!`,
      "description": `Vote Away!`
    })
  }).then(playlist => {
    console.log(playlist);
    return playlist.json();
  }).catch(err => {
    console.log(err);
  })
  // const options = {
  //   method: 'POST',
  //   url: `https://api.spotify.com/v1/users/${spotify_id}/playlists`,
  //   headers: {
  //     Authorization: `Bearer ${curAccessToken}`,
  //   },
  //   contentType: 'application/json',
  //   params: {
  //     name: 'PollPlay Playlist!',
  //     description: 'Vote Away!',
  //   }
  // };

  // try {
  //   const {data} = await axios(options);
  //   console.log('PLAYLIST INIT   :', data);
  //   res.send(data)
  // } catch(err) {
  //   console.log(err);
  //   res.sendStatus(500);
  // }
})

module.exports = router;















