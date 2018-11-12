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

const getSongInRoom = (req, res) => {
  // pool.query(`SELECT * FROM songs`, (err, result) => {
  //   if ( err ) {
  //     console.log(err)
  //   } else {
  //     res.json(result.rows)
  //   }
  // })
  console.log('params: ', req.params)
  console.log('query: ', req.query)
  let text = `SELECT * FROM songs WHERE artist = '${req.query.artist}'`;
  pool.query(text, (err, result) => {
    if (err) {
      // console.log(err);
      res.sendStatus(500);
    } else {
      res.json(result.rows);
    }
  })
}

module.exports = {
  getSongInRoom
}


























