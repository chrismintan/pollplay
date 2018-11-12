const express = require('express');
const router = express.Router();
const db = require('../../../database/index')
const axios = require('axios');

router.get('/search', (req, res) => {
  const {q} = req.query;
  db.getUserByRoomId(req.session.roomId, (err, data) => {
    if (err) {
      console.log('we messed up our getting user:', err)
      res.sendStatus(500)
    } else {
      const [user] = data;
      let accessToken = user.access_token;

      axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          q: q,
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
    }
  })
});

module.exports = router;