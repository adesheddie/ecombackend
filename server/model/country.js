var mongoose=require('mongoose');

var Schema = mongoose.Schema;

var local=new Schema({
_id: Schema.ObjectId,
name: String,
states:[{
    name:String,
    _id:Schema.ObjectId,
    }]
}, {versionKey:false});

module.exports=mongoose.model('countries',local);