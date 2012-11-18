var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var ArticleSchema = new Schema({
      title: {type:String, default:'', trim:true}
    , content: {type:String, default:'', trim:true}
    , user: {type:Schema.ObjectId, ref:'User'}
    , categoryName: {type:String, default:'', trim:true}
    , comments: [{type : Schema.ObjectId, ref : 'Comment'}]
    , createdAt:{type:Date, default:Date.now}
    , updatedAt:{type:Date, default:Date.now}
});

ArticleSchema.statics.count = function() {
    return this.count({});
}

ArticleSchema.path('title').validate(function (title) {
    return title.length > 0
}, 'Article title cannot be blank')

ArticleSchema.path('content').validate(function (content) {
    return content.length > 0
}, 'Article body cannot be blank')

mongoose.model('Article', ArticleSchema);