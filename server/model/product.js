var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//var Schema = new mongoose.Schema({ key: keyType, }, { timestamps: true });
var productSchema = new Schema({
    _id: Schema.ObjectId,
    st_date: Date,
    name: String,
    description: String,
    price: Number,
    avatar:String
}
    , { versionKey: false }
    );

var schemaObject = mongoose.model('product', productSchema);
module.exports = schemaObject;