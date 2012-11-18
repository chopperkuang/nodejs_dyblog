var mongoose = require('mongoose')
    , Article = mongoose.model('Article')
    , User = mongoose.model('User')
    , async = require('async');


module.exports = function (app, passport, auth) {
    var users = require('../app/controllers/users')
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/user', users.create);
    app.post('/users/session', passport.authenticate('local', {failureRedirect:'/login'}), users.session);


    // article routes
    var articles = require('../app/controllers/articles');
    app.get('/articles', articles.index);
    app.get('/articles/:id', articles.show);
    app.get('/articles/new', auth.requiresLogin, articles.new);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:id/edit', auth.requiresLogin, auth.article.hasAuthorization, articles.edit);
    app.put('/articles/:id', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    app.del('/articles/:id', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

    //拦截参数中带有 :id，预装载数据。在Controller中，不需要再查询
    app.param('id', function (req, res, next, id) {
        Article.findOne({_id:id})
            .populate('user')
            .populate('comments')
            .exec(function (err, article) {
                if (err) return next(err);
                if (!article) return next(new Error('Failed to load article ' + id))
                req.article = article;

                var populateComments = function (comment, cb) {
                    User
                        .findOne({ _id:comment._user })
                        .select('name')
                        .exec(function (err, user) {
                            if (err) return next(err)
                            comment.user = user
                            cb(null, comment)
                        })
                }
                if (article.comments.length) {
                    async.map(req.article.comments, populateComments, function (err, results) {
                        next(err);
                    });
                } else {
                    next();
                }
            });
    });
    // categories routes
    var categories = require('../app/controllers/categories');
    app.get('/categories', categories.index);
    app.post('/categories', auth.requiresLogin, categories.create);

    // comment routes
    var comments = require('../app/controllers/comments')
    app.post('/articles/:id/comments', auth.requiresLogin, comments.create)

    app.get('/', articles.index);
}