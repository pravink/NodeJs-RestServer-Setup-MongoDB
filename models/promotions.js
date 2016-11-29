var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var promotionSchema = new Schema({
	name: {
	 type : String, 
	 required:true, 
	 unique:true
	},
	image: {
	 type : String, 
	 required:true	 
	},	
	label: {
	 type : String, 
	 required:false,
	 default: ''  
	},
	price: {
	 type : Currency, 
	 required:true	 
	},
	description : { 
		type : String, 
		required:true
	}

}, 	{	timestamps : true
});

var promotions = mongoose.model('Promotion', promotionSchema);

module.exports = promotions;