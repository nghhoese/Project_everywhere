const express = require('express');
const app = express();
const logger = require('morgan');
const config = require('../config/config');
const ConnectRoles = require('connect-roles');
const user = require('./middleware/user');
const passport = require('passport');
const path = require('path');
require('./middleware/auth/auth');
var dir = path.join(__dirname, '../public');
app.use(express.static(dir));

app.use(logger('dev'));
app.use(express.json({limit: '10mb', extended: true}));
app.use(express.urlencoded({limit: '10mb', extended: false }));
app.use(user.middleware());

app.use('/', require('./home'));
app.use('/users', require('./users/users'));
app.use('/tasks', require('./tasks'));
app.use('/day_items', passport.authenticate('jwt', { session: false }), require('./dayItems'));
app.use('/taskprogress', passport.authenticate('jwt', { session: false }), require('./taskProgress'));
app.use('/categories', require('./categories'));
app.use('/healthcarefacilities', passport.authenticate('jwt', { session: false }), require('./healthcareFacilities'));
app.use('/needyusers', passport.authenticate('jwt', { session: false }), require('./users/needyUsers'));
app.use('/caregivers', passport.authenticate('jwt', { session: false }), require('./users/caregivers'));
app.use('/guardians', passport.authenticate('jwt', { session: false }), require('./users/guardians'));
app.use('/facilitymanagers', passport.authenticate('jwt', { session: false }), require('./users/facilitymanagers'));

// catch 404 and forward to error handler
app.use((req, res) => {
    res.status(404).json({ error: 'route not found' });
});

app.listen(config.port, err => {
    if (err) throw err;
    console.log(`Listening on port ${config.port}`);
});

module.exports = app;
