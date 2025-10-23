'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();

// Serve static files
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); // For FCC testing only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page
app.route('/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// FCC testing routes
fccTestingRoutes(app);

// API routes
apiRoutes(app);

// 404 middleware
app.use((req, res) => {
  res.status(404).type('text').send('Not Found');
});

// --- PORT setup ---
const port = process.env.PORT || 3000;

// --- Start Server ---
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  
  // Delay tests until server is ready
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(() => {
      try {
        runner.run();
      } catch (err) {
        console.error('Tests are not valid:');
        console.error(err);
      }
    }, 5000); // give Render enough startup time
  }
});

module.exports = app; // for testing
