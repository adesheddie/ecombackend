var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
//Generated Password lenth max 72bytes/60 characters

var Schema = mongoose.Schema;
//var Schema = new mongoose.Schema({ key: keyType, }, { timestamps: true });
var dbSchema = new Schema({
    created: { type: Date },
    updated: { type: Date },
    username:{ type:String,unique:true },
    password:{ type:String,select:false },
    fullname:{ type:String },
    email:{ type:String }
},
{ versionKey: false });

dbSchema.pre('save',function(next){
    now=new Date();
    this.update = now;
    if(!this.created){
        this.created = now;
    }

    var user = this;
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(user.password,salt,function(err1,hash){
            user.password = hash;
            next();
        });
    });
});

dbSchema.methods.comparePassword = function(password,done){
    bcrypt.compare(password,this.password,function(err,isMatch){
        done(err,isMatch);
    });
};
dbSchema.methods.changePassword = function(password,done){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(password,salt,function(err1,hash){
           // user.password = hash;
            done(err,hash);
        });
    });
};
var schemaObject = mongoose.model('user', dbSchema);
module.exports = schemaObject;