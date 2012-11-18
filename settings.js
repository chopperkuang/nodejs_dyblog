var express = require('express')
    , expressLayouts = require('express-ejs-layouts')
    , mongoStore = require('connect-mongodb')
    , moment = require('moment');

exports.boot = function (app, config, passport) {
    bootApplication(app, config, passport);
}

// App settings and middleware

function bootApplication(app, config, passport) {

    app.set('showStackError', true);
    app.use(express.static(__dirname + '/public'));

    app.set('views', __dirname + '/app/views');
    app.set('view engine', 'ejs');

    app.configure(function () {
        // dynamic helpers
        app.use(function (req, res, next) {
            res.locals.appName = 'Nodejs Dyblog Demo';
            res.locals.title = 'Nodejs Dyblog Demo';
            res.locals.formatDate = function(date){
                return moment(date).format('YYYY-MM-DD HH:ss:ss');
            };
            res.locals.req = req;
            res.locals.user = req.user;
            next();
        });


        app.use(express.favicon());
        app.use(express.logger('dev'));

        app.use(expressLayouts);
        app.set('layout', 'layouts/layout');

        app.use(express.cookieParser());

        app.use(express.bodyParser());
        app.use(express.methodOverride());

        app.use(express.session({
            secret:'noobjs',
            store:new mongoStore({
                url:config.db,
                collection:'sessions'
            })
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(app.router);
    });
    app.set('showStackError', false);
}