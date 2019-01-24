var mongoose=require('mongoose');

var Schema = mongoose.Schema;

var local=new Schema({
userid:Schema.ObjectId,
createdat:{type:Date}
}, {versionKey:false});

module.exports=mongoose.model('forgotpassword',local);