const express = require('express');
const router = express.Router();
const db = require('../../../database/index');
const cookieSession = require('cookie-session');

// Legacy route --
// router.get('/isLoggedIn', (req, res) => {
//   res.json(req.session.spotifyId || null);
// });

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

router.post('/rooms/:roomId', (req, res) => {
  db.showAllSongsInRoom( { roomId: req.params.roomId }, (err, result) => {
    if ( err ) {
      console.log('NO DATA:', err);
      res.sendStatus(500);
    } else {
      req.session
    }
  })
})

router.get('/getAllSongs', (req, res) => {
  let roomId = req.session.roomId;
  console.log('getAllSongs roomID=',roomId)
  console.log('HER EIS REQ.session',req.session)
  db.showAllUnplayedSongsInRoom(roomId, (err,data) => {
    if (err) {
      console.log('NO DATA 4 U',err);
      res.sendStatus(500);
    } else {
      console.log('data reterieval success!,',data);
      res.json(data);
    }
  });
});

router.post('/saveSong', (req,res) => {
  let roomId = req.session.roomId;
  let songObj = req.body.songObj;
  //ADD SONG TO CURRENT ROOM
  db.addSongToRoom(songObj, roomId, function(err,data){
    if (err) {
      console.log('NOPE insert song',err);
      res.sendStatus(500);
    } else {
      console.log('data insertion success!,',data);
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