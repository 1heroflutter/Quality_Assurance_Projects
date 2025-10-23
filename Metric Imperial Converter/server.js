'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); // FCC testing only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// For FCC testing
fccTestingRoutes(app);

// Routing for API
apiRoutes(app);

// 404 Not Found middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const port = process.env.PORT || 3000;

// Start our server and tests!
const listener = app.listen(port, function () {
  console.log('Listening on port ' + port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        console.log('Tests are not valid:');
        console.log(e);
      }
    }, 1500);
  }
});

module.exports = app; // ✅ Required for FCC tests
