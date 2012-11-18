var express = require('express')
    , fs = require('fs')
    , passport = require('passport');

require('express-namespace');

// Load configurations
var env = process.env.NODE_ENV || 'development'
    , config = require('./config/config')[env]
    , auth = require('./config/authorization');

// Bootstrap db connection
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/app/models'
    , model_files = fs.readdirSync(models_path);

model_files.forEach(function (file) {
    require(models_path + '/' + file)
});

require('./config/passport').boot(passport, config, auth);

var app = express();
require('./settings').boot(app, config, passport);

// Bootstrap routes
require('./config/routes')(app, passport, auth);


// Start the app by listening on <port>
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express app started on port ' + port);