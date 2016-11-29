var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

var favoriteSchema = new Schema({	
	_id:  {type:ObjectIdSchema, default: new ObjectId()},

	 postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
	
	dishes : [{ 
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
	}]

}, 	{	timestamps : true
});

favoriteSchema.plugin(passportLocalMongoose);

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;