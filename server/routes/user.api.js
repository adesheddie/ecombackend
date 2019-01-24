var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var mongojs = require("mongojs"); //for data with mongodb
var isodate = require("isodate");
var db = require('../model/user.js');
var forgetpassword_db = require('../model/forgotpassword.js');
var auth = require('../auth/auth');
var Templation  = require('nodemailer-templation');
var path = require('path');
var fs = require('fs');

router.post('/signin',function(req,res){
    db.findOne({username:req.body.username},'+password',function(err,user){
        if(!user){
            console.log("user");
             return res.send({success:false,message:'username Incorrect'});
            }
        else{
            user.comparePassword(req.body.password,function(err,isMatch){
                if(!isMatch){
                    console.log("Wrong user");
                    return res.json({success:false,message:'Wrong Password'});
                }
                res.json({success:true,token:auth.createJWT(user),username:user.username});
            });
        }
    });
});

router.post('/signup',function(req,res){
    console.log(req.body);
    db.findOne({username:req.body.username},function(err,existingUser){
        if(existingUser){ return res.send({success:false,message:'username already exists'});}
        else{
            var user = new db({
                username:req.body.username,
                password:req.body.password,
                fullname:req.body.fullname,
            });
            user.save(function(err,doc){
                if(err){
                  res.json({success:false,message:err.message});
                    }
                    res.json({success:true,message:'data saved' });
            });
        }
    });
});

router.get('/list',auth.ensureAuthenticated,function(req,res){
    
    res.send({message:'success'});
});
router.get('/list2',function(req,res){
    
    res.send({message:'success'});
});
router.get('/list3',function(req,res){
    
    res.send({message:'success'});
});

router.put('/changePassword',function(req,res){
    console.log('/changePassword');
    var user = req.body;
    console.log(user);
    
    db.findOne({username:req.body.username},'+password',function(err,user){
        if(!user){
            console.log("user");
             return res.send({success:false,message:'username Incorrect'});
            }
        else{
            user.comparePassword(req.body.oldpassword,function(err,isMatch){
                if(!isMatch){
                    console.log("Wrong user");
                    return res.send({success:false,message:'Wrong Password'});
                }
                 else{
                    console.log('login Successfully');
                    user.changePassword(req.body.password,function(err,hashpass){
                        if(err){
                            console.log("Wrong user changePassword");
                            return res.send({success:false,message:'Not Updated'});
                        }
                        else{
                            console.log('user.password');
                            console.log(hashpass);
                            console.log(user);
                            db.findOneAndUpdate({'_id':mongojs.ObjectId(user._id)},{'password':hashpass},function(err1,doc1){
                                if(err1) 
                                    res.send({success:false,message:err1.message});
                                else 
                                    res.send({success:true,message:'Operation Successful.'});
                            })
                            //res.send({success:true,message:'Operation Successful.'});
                        }
                    })
                }
                //res.json({success:true,token:auth.createJWT(user),username:user.username});
            });
        }
    });
});
router.post('/forgotpassword',function(req,res){
    console.log('/forgotpassword');
   // var user = req.body;
    //console.log(user);
    
    db.findOne({$or:[{email:req.body.username},{username:req.body.username}]},function(err,user){
        if(!user)
        {
            console.log("user");
            return res.send({success:false,message:'username/email Incorrect'});
        }
        else{
            console.log(user);

            var someFile = path.resolve(__dirname, '../../uploads/forgotPassword.html');
            var someFile2 = path.resolve(__dirname, '../../uploads/forgotPassword.1.html');
                          var dataobj = new  forgetpassword_db({
                    userid:user._id,
                    //token:token,
                    createdat:new Date()
                });
                dataobj.save(function(err,doc){
                    if(err){ }
                    else {
                        fs.readFile(someFile, 'utf8', function (err,data) {
                            if (err) {
                              return console.log(err);
                            }
                            data.replace('##USERNAME##', user.fullname);
                            var token = auth.createJWTFogetPassword(doc._id);
                            var __id = mongojs.ObjectId();
                            var result = data.replace('##USERNAME##', user.fullname)
                            .replace('##msg1##','Your forgot password request has been accepted. Please click on below mention Link and change your password.')
                            .replace('##msg2##','This link is valid only for 30 minutes.')
                            .replace('##LINK##',"<a href='http://localhost:4200/resetpassword/"+token+"' > Reset Password </a>");
                fs.readFile(someFile2, 'utf8', function (err,data) {
                    if (err) {
                      return console.log(err);
                    }
                    fs.writeFile(someFile2, result, 'utf8', function (err) {
                        if (err) return console.log(err);
                        var Mailer = new Templation({
                        from: 'info@techlearning.in',
                        templates: {
                        reply: someFile2
                        },
                        transportOptions: {
                        service: 'Gmail',
                        auth: {
                            user: 'demodeveloper2016@gmail.com',
                            pass: '!@#demodeveloper*()',
                        }
                        }
                    });
                    console.log('user.email :> ' + user.email);
                    Mailer.send({
                        to: user.email,
                        subject: 'Curtfly.com Forgot Password',
                        template: 'reply',
                        messageData: {
                        title: 'Hello Dude',
                        name: 'Woah',
                        message: 'Far Out'
                        }
                    });
            });
        });
    })
}
    //})// dataobj completion.
            return res.send({success:true,message:'user found'});
        });
    }
});
});
//router.get('/resetinfo/:refid',auth.ensureJWTFogetPassword,function(req,res){
    router.get('/resetinfo',auth.ensureJWTFogetPassword,function(req,res){
    console.log(req);
    forgetpassword_db.find({'_id':mongojs.ObjectId(req.token)},function(err,doc){
        if(err) return res.send({success:false,message:'Wrong Request'});
        else {
            console.log(doc);
                db.find({'_id':mongojs.ObjectId(doc[0].userid)},function(err1,doc1){
                    console.log('doc1');
                    console.log(doc1);
                    if(err1) throw err1;
                    return res.send({success:true,message:doc1});
                })

        }
     //   return res.send({success:true,message:doc});
    })
});



router.post('/resetpassword',function(req,res){
    console.log('/changePassword');
    var user = req.body;
    console.log(user);
    
    db.findOne({username:req.body.username},function(err,user){
        if(!user){
            console.log("user");
             return res.send({success:false,message:'username Incorrect'});
            }
        else{
            user.changePassword(req.body.password,function(err,hashpass){
                if(err){
                    console.log("Wrong user changePassword");
                    return res.send({success:false,message:'Not Updated'});
                }
                else{
                    console.log('user.password');
                    console.log(hashpass);
                    console.log(user);
                    db.findOneAndUpdate({'_id':mongojs.ObjectId(user._id)},{'password':hashpass},function(err1,doc1){
                        if(err1) 
                            res.send({success:false,message:err1.message});
                        else {
//------------------------------------send email
                    var someFile = path.resolve(__dirname, '../../uploads/forgotPassword.html');
                    var someFile2 = path.resolve(__dirname, '../../uploads/forgotPassword.1.html');
             
    
            fs.readFile(someFile, 'utf8', function (err,data) {
                if (err) {
                  return console.log(err);
                }
                data.replace('##USERNAME##', doc1.fullname);
                
                var result = data.replace('##USERNAME##', user.fullname)
                .replace('##msg1##','')
                            .replace('##msg2##','')
                .replace('##LINK##',"<div>Your Password Has Been Updated Successfully.</div");
    fs.readFile(someFile2, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        fs.writeFile(someFile2, result, 'utf8', function (err) {
            if (err) return console.log(err);
            var Mailer = new Templation({
            from: 'info@techlearning.in',
            templates: {
            reply: someFile2
            },
            transportOptions: {
            service: 'Gmail',
            auth: {
                user: 'demodeveloper2016@gmail.com',
                pass: '!@#demodeveloper*()',
            }
            }
        });
        
            Mailer.send({
                to: doc1.email,
                subject: 'Curtfly.com Forgot Password',
                template: 'reply',
                messageData: {
                    title: 'Hello Dude',
                    name: 'Woah',
                    message: 'Far Out'
                }
            });

        });
        });
        });
        res.send({success:true,message:'Password Successfully Updated.'});
    }//

//-----------------------------------------------------------------------------

            })
        }
    });
        }
    });
    });
module.exports = router;