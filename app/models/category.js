var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Promise = mongoose.Promise;

var CategorySchema = new Schema({
    name: {type : String, default : '', trim : true}
  , createdAt  : {type : Date, default : Date.now}
});

CategorySchema.path('name').validate(function (name){
    return name.length > 0;
}, 'Category name cannot be blank');


CategorySchema.statics.all = function() {
    return this.find({});
}


mongoose.model('Category', CategorySchema);