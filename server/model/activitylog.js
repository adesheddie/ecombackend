
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Useractivity = new Schema({
 activityname: {
		type: String,
		lowercase: true
	},
	ipaddress: {
		type: String
	},
	adminread:{type:Boolean,"default":false},
	userread:{type:Boolean},
	created: { type: Date,default:Date.now},
	comment:{type:String},
	user_id:{type:Schema.ObjectId},

}, {
	timestamps: true
});

module.exports = mongoose.model('activitylog', Useractivity);