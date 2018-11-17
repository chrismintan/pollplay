const express = require('express');
const router = express.Router();
const db = require('../../../database/index');
const cookieSession = require('cookie-session');
const axios = require('axios');

// Legacy route --
// router.get('/isLoggedIn', (req, res) => {
//   res.json(req.session.spotifyId || null);
// });

router.put('/upVoteSong', (req, res) => {
  db.upVoteSong( { roomID: req.body.roomID, trackURI: req.body.trackURI }, (err, result) => {
    if ( err ) {
      console.log('Error:', err);
    } else {
      res.json(result);
    }
  })
})

router.delete('/removeSong', (req, res) => {
  db.removeSongFromRoom( { roomId: req.query.roomID, trackURI: req.query.trackURI }, (err, result) => {
    if ( err ) {
      console.log('Error:', err);
    } else {
      res.json(result)
    }
  })
})

router.get('/rooms/:roomId', (req, res) => {
  db.getRoomData({ room: req.query.query }, (err, result) => {
    if ( err ) {
      console.log(err);
    } else {
      res.json(result)
    }
  })
})

router.post('/createRoom', (req, res) => {
  db.addRoom({ roomName: req.body.roomName, spotifyId: req.body.spotifyId }, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log('room created!', result.rows[0].name)
      res.json(result.rows[0].name);
    }
  });
});

router.post

router.get('/search', (req, res) => {
  const token = req.query.token
  const query = req.query.query;
  axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`
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

router.get('/searchArtist', (req, res) => {
  const token = req.query.token
  const query = req.query.query;
  console.log(query)
  axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      q: `artist: "${query}"`,
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

router.get('/getAllSongs', (req, res) => {
  console.log(req.query.roomId)
  db.getSongsInRoom( {roomId: req.query.roomId} , (err, result) => {
    if (err) {
      console.log('Unable to get all songs',err);
      res.sendStatus(500);
    } else {
      console.log('Got all songs!', result);
      res.json(result);
    }
  });
});

router.post('/saveSong', (req,res) => {
  db.addSongToRoom( {songObj: req.body} , (err, result) => {
    if (err) {
      console.log('Unable to insert song', err);
      res.sendStatus(500);
    } else {
      console.log('Song added!')
      res.end();
    }
  });
});

router.get('/testing', (req, res) => {
  let roomId = '1'
  db.getSonginRoom(roomId, function(err, data) {
    if ( err ) {
      console.log('Error:', err);
      res.sendStatus(500);
    } else {
      console.log('Success!', data);
      res.end()
    }
  })
})

module.exports = router;