
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReturnFAQ = new Schema({
    name:String,
	created: { type: Date,default:Date.now},
    user_id:{type:Schema.ObjectId},
    updated: { type: Date,default:Date.now},
    details:[{
        name:String,
        created: { type: Date,default:Date.now},
        updated: { type: Date,default:Date.now},
    }]
}, {
	timestamps: true
});

module.exports = mongoose.model('ReturnFAQ', ReturnFAQ);