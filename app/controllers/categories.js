var mongoose = require('mongoose')
    , Category = mongoose.model('Category');

require('express-mongoose');

exports.index = function(req, res) {
    res.send(Category.all());
}


exports.create = function(req, res) {
    var category = new Category(req.body);

    category.save(function(err){
        if(err) res.send({status:'fail', message: '添加失败！'});
        res.send({status:'ok'});
    });
}