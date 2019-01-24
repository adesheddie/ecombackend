var express = require('express');
var auth = require('../auth/auth');
var mongojs = require("mongojs"); //for data with mongodb
var isodate = require("isodate");
var db = require('../model/activitylog.js');

 
function TrackLog(page){
    console.log("this is page traked : " + page);
    var log = new db({
        activityname:page.activityname,
        ipaddress:page.ipaddress,
        adminread:false,
        userread:false,
        comment:page.comment,
        user_id:page.user_id
    });
    log.save(function(err,doc){
        if(err){
           // res.json({success:false,message:err.message});
        }
       // res.json({success:true,message:'data saved' });
    });   
    return true;  
}

module.exports.TrackLog=TrackLog;


