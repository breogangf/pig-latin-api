const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const router = express.Router();
const logger = require('./helpers/logger');
const healthChecker = require('./helpers/healthChecker');

const mongoose = require('mongoose');
const session = require('express-session');

const config = require('./config');

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

//Express-session configuration
app.use(session({
  secret: config.EXPRESS_SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}));


// Import controllers
const TranslationCtrl = require('./controllers/translation');
const UserCtrl = require('./controllers/user');

app.use(router);

// API routes
router.route('/')
  .get(healthChecker.initialCheck);

router.route(['/users', '/users/login'])
  .post(UserCtrl.loginUser);

router.route('/translations')
  .post(TranslationCtrl.translate)
  .get(TranslationCtrl.getTranslationsByUserId);

app.use('/', router);

// Start server
app.listen(port, () => {
  logger.log(`Node server running on port ${port}`);
});
