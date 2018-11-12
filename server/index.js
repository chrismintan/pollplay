require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../client/dist'));

app.use('/api', routes);

app.get('/*', (req, res) => {
  console.log(req.url);
  // res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  res.render(__dirname, '../client/src/index.jsx')
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

