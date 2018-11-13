const express = require('express');
const router = express.Router();
const db = require('../../../database/index');
const axios = require('axios');
const btoa = require('btoa');

const accessToken = async (req, res, next) => {
  db.getAccessToken({req: 1}, (err, result) => {
    if ( err ) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(result.rows[0].access_token);
      curAccessToken = result.rows[0].access_token;
      next();
    }
  })
}

router.use(accessToken)

router.get('/search', (req, res) => {
  console.log(req.query.query)
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
  //         limit: 20
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
      limit: 20
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
  console.log('HERE')
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

module.exports = router;















