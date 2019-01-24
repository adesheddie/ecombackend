var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');

module.exports = {

    ensureAuthenticated:function(req,res,next){
        console.log('ensureAuthenticated called');
        if(!req.headers.authorization){
            return res.status(401).send({message:"Please make sure your request has been Authorized."});
        }

        var token = req.headers.authorization.split(' ')[1];
        var payload = null;
        console.log('token');
        console.log(token);
        try{
            payload = jwt.decode(token,config.TOKEN_SECRET);
        }
        catch(err){
            return res.status(401).send({message:err.message});
        }

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:"Token has expired"});
        }
        req.user = payload.sub;
        console.log('req.user');
        console.log(req.user);
        next();
    },
    /*
  * Generate JSON Web Token
  */
   // THE ENTIRE JWT
   createJWT:function(user){
       var payload={
           sub:user._id,
           iat:moment().unix(),
           exp:moment().add(14,'days').unix()
       };
       return jwt.encode(payload,config.TOKEN_SECRET);
   },
   createJWTFogetPassword:function(token){
       console.log(token);
    var payload={
        sub:token,
        iat:moment().unix(),
        exp:moment().add(30,'minutes').unix()
    };
    return jwt.encode(payload,config.TOKEN_SECRET);
},
ensureJWTFogetPassword:function(req,res,next){
    console.log('ensureAuthenticated called');
    if(!req.headers.authorization){
        return res.status(401).send({message:"Please make sure your request has been Authorized."});
    }

    var token = req.headers.authorization.split(' ')[1];
    var payload = null;
    console.log('token');
    console.log(token);
    try{
        payload = jwt.decode(token,config.TOKEN_SECRET);
    }
    catch(err){
        return res.status(401).send({message:err.message});
    }

    if(payload.exp <= moment().unix()){
        return res.status(401).send({message:"Token has expired"});
    }
    req.token = payload.sub;
    console.log('req.user');
    console.log(req.token);
    next();
}
}