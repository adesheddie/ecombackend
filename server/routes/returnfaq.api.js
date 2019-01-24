var express=require('express');
var router=express.Router();
var mongojs=require('mongojs');
var db = require('../model/returnFaq.js');
var auth = require('../auth/auth');

router.get('/list',auth.ensureAuthenticated,function(req,res){
    db.find({},function(err,docs){
        if(err) console.log(err);
        res.send(JSON.stringify(docs));
    });
});

router.get('/list/:id',auth.ensureAuthenticated,function(req,res){
    var id=req.params.id;
    db.find({"_id":mongojs.ObjectId(id)},function(err,docs){
        if(err) console.log(err);
        res.send(JSON.stringify(docs));
    });
});


router.post('/AddFAQ',auth.ensureAuthenticated,function(req,res){
   var data = {
    _id:mongojs.ObjectId(),
    name:req.body.name,
    user_id:req.body.user_id
   }
   console.log(data);
   var newrecord=new db(data);
   
   newrecord.save(function(err,docs){
       if(err){
           res.status(500).send({mesage:err.message});
         }
         res.json(docs);
   });
});

router.put('/updateFAQ',auth.ensureAuthenticated,function(req,res){

    var id=req.body._id;   //update id
    var query={'_id':mongojs.ObjectId(id)};
    var update={name:req.body.name,
        user_id:req.body.user_id};
    db.findOneAndUpdate(query,update,function(err,doc){
        if(err) throw err;
        res.json(doc);
    });
});

router.delete('/deleteReturnFAQ/:id',auth.ensureAuthenticated,function(req,res){
    db.findByIdAndRemove(mongojs.ObjectId(req.params.id),function(err){
        if(err) res.send(err);
        else res.send({Message:'Success'}) ;
    });
});


router.get('/listFAQdetails/:id',auth.ensureAuthenticated,function(req,res){
    var id=req.params.id;
    db.findOne({'_id':id},{details:1},function(err,result){
        if(err) throw err;
        res.json(result);
    });
});

router.put('/updateFAQdetails/:id',auth.ensureAuthenticated,function(req,res){
    console.log(req.body.data);
    var id=req.params.id;
    db.findOne({'details._id':id},function(err,result){
        if(err) throw err;
        result.details.id(id).name=req.body.name;
        result.details.id(id).user_id=req.body.user_id;
        result.save();
    });
   //res.end("Success");
});



router.put('/saveFAQdetails/:id',auth.ensureAuthenticated,function(req,res){
    var id=req.params.id;   //update id
    var data={_id:mongojs.ObjectId(),name:req.body.name,user_id=req.body.user_id};
    var query={'_id':mongojs.ObjectId(id)};
   
    db.findOneAndUpdate(query,{$push: {details:data}},function(err,docs){
        if(err) throw err;
        console.log("Success");
        res.json(docs);
    });

});



router.delete('/deleteReturnFAQdetails/:id',auth.ensureAuthenticated,function(req,res){
    db.findOne({'details._id':id},function(err,result){
        if(err) throw err;
        result.details.id(id).remove();
        result.save();
    });
});

module.exports = router;
