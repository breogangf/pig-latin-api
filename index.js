const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const router = express.Router();
const logger = require('./helpers/logger');
const healthChecker = require('./helpers/healthChecker');

const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

module.exports = app;

// Connection to DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/latin-pig-api',
  (err) => {
    if (err) throw err;
  });

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());


// Import controllers
const TranslatorCtrl = require('./controllers/translator');

app.use(router);

// API routes
router.route('/')
  .get(healthChecker.initialCheck);

router.route('/translate')
  .post(TranslatorCtrl.translate);

app.use('/', router);

// Start server
app.listen(port, () => {
  logger.log(`Node server running on port ${port}`);
});
