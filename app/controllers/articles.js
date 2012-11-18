var mongoose = require('mongoose')
    , Article = mongoose.model('Article')
    , Category = mongoose.model('Category')
    , _ = require('underscore');

require('express-mongoose');

exports.index = function (req, res) {

    var filter = {};
    if(!_.isUndefined(req.param('cateName'))) {
        filter.categoryName =  req.param('cateName');
    }
    console.log("fitler=>" + filter);
    Article.find(filter)
        .populate('user')
        .sort({'createdAt':-1})
        .exec(function (err, articles) {
            res.render('article/index', {
                title:'List of Articles',
                categories:Category.all(),
                articles:articles
            });
        });
}

exports.show = function (req, res) {
    res.render('article/show', {
        categories:Category.all(),
        title:req.article.title,
        article:req.article
    });
}

exports.create = function (req, res) {
    var article = new Article(req.body);
    article.user = req.user;

    article.save(function (err) {
        console.log(article);
        if (err) res.send({status:'fail', message:"添加失败"});
        res.send({status:'ok', article:article});
    });
}

exports.edit = function (req, res) {
    res.render('article/edit', {
        title:'编辑 ' + req.article.title,
        categories: Category.all(),
        article:req.article
    });
}

exports.update = function (req, res) {

    var article = req.article;

    article = _.extend(article, req.body) //复制

    article.save(function (err, doc) {
        if (err) {
            res.render('article/edit', {
                title:'Edit Article',
                article:article,
                categories: Category.all(),
                errors:err.errors
            });
        } else {
            res.redirect('/articles/' + article._id);
        }
    });
}

exports.destroy = function (req, res) {
    var article = req.article;
    article.remove(function (err) {
        if(err) res.send({status: 'fail', message: '删除失败！'})
        res.send({status: 'ok'});
    });
}

	