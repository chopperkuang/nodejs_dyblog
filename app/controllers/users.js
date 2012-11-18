var mongoose = require('mongoose')
    , User = mongoose.model('User');

exports.login = function (req, res) {
    res.render('users/login', {layout:'layouts/user_layout', title:'登录' });
}

exports.signup = function (req, res) {
    res.render('users/signup', {layout:'layouts/user_layout', title:'注册' });
}

exports.session = function (req, res) {
    res.redirect('/');
}

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}

exports.create = function (req, res) {
    console.log("create .... ");
    console.log(req.body);
    var user = new User(req.body);
    user.save(function (err) {
        if (err) return res.render('users/signup', {errors:err.errors});
        req.login(user, function (err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
}