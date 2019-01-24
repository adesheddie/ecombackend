var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    var currencySchema = new Schema({
            created: { type: Date,"defualt":new Date()},
            updated: { type: Date },
            currency_name: {type: String,unique:true},
            currency_code:{type:String,unique:true},
            currency_symbol_left:{type:String},
            currency_symbol_right:{type:String},
            currency_value:[{
                      currency_price:{type:String},
                      currency_status:{type:Boolean},
                      created:{type: Date},
                      updated: { type: Date },
                    }],
            country_id:{type:Schema.ObjectId},
            status:{type: Boolean},
            userid:{type:Schema.ObjectId}
});
var Currency = mongoose.model('currency', currencySchema);
module.exports =  Currency;  