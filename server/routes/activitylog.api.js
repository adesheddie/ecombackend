var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');

var mongojs = require("mongojs"); //for data with mongodb
var isodate = require("isodate");

var db = require('../model/activitylog.js');

router.post('/save',function(req,res){  
            var log = new db({
                activityname:req.body.activityname,
                ipaddress:req.body.ipaddress,
                adminread:req.body.adminread,
                userread:req.body.userread,
                comment:req.body.comment,
                user_id:req.body.user_id
            });
            log.save(function(err,doc){
                if(err){
                    res.json({success:false,message:err.message});
                }
                res.json({success:true,message:'data saved' });
            });     
});

router.get('/list',auth.ensureAuthenticated,function(req,res){
    db.find({}, function (err, docs) {
        if (err) throw err;
        res.end(JSON.stringify(docs));
    });
});
router.get('/list1',function(req,res){
    db.find({}, function (err, docs) {
        if (err) throw err;
        res.end(JSON.stringify(docs));
    });
});
module.exports = router;