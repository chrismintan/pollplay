const pg = require('pg');
const url = require('url');
require('dotenv').config();

var configs;

if ( process.env.DATABASE_URL ) {

  const params = url.parse(process.env.DATABASE_URL)

}
