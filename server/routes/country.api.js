var express=require('express');
var router=express.Router({caseSensitive: true});
var mongojs=require('mongojs');
var db = require('../model/country.js');


router.get('/list',function(req,res){
    db.find({},function(err,docs){
        if(err) console.log(err);
        res.send(JSON.stringify(docs));
    });
});

router.get('/list/:id',function(req,res){
    var id=req.params.id;
    db.find({"_id":mongojs.ObjectId(id)},function(err,docs){
        if(err) console.log(err);
        res.send(JSON.stringify(docs));
    });
});


router.post('/Add',function(req,res){
      
   var data = {
    _id:mongojs.ObjectId(),
   name:req.body.data.name,
   }
   console.log(data);
   var newrecord=new db(data);
   
   newrecord.save(function(err,result){
       if(err){
           res.status(500).send({mesage:err.message});
         }
         res.json(result);
       
      
   });
});

router.put('/updatecountry',function(req,res){
    console.log(req.body.data);
    var id=req.body.data._id;   //update id
    var query={'_id':mongojs.ObjectId(id)};
    var update={countries:req.body.data.countries};
    console.log('Here is '+req.body.data.countries);
    db.findOneAndUpdate(query,update,function(err,res){
        if(err) throw err;
        console.log("Success");
    });
});

router.put('/update',function(req,res){
    console.log(req.body.data);
    var id=req.body.data._id;   //update id
    var query={'_id':mongojs.ObjectId(id)};
    var update={name:req.body.data.name};
    db.findOneAndUpdate(query,update,function(err,doc){
        if(err) throw err;
            console.log("Success");
            res.json(doc);
    });
});

router.post('/savestate',function(req,res){
    var data = {_id:mongojs.ObjectId(),
        Name:req.body.data.Name,
        State:req.body.data.State,
        Country_id:req.body.data.Country_id
    }
    console.log(data);
    var newrecord = new local(data);
    newrecord.save(function(err,result){
        if(err){
            res.status(500).send({mesage:err.message});
            res.send(200).end();
        }
    });
});

router.put('/updatestate/:id',function(req,res){
    console.log(req.body.data);
    var id=req.params.id;
    db.findOne({'states._id':id},function(err,result){
        if(err) throw err;
        result.states.id(id).name=req.body.data.name
        result.save();
    });
   //res.end("Success");
});

router.post('/deletestate/:id',function(req,res){
    console.log(req.body.data);
    var id=req.params.id;
    db.findOne({'states._id':id},function(err,result){
    
    if(err) throw err;
    result.states.id(id).remove();
    result.save();
       res.json(result);
    });
    //res.end("Success");

    
});

router.put('/savestate/:id',function(req,res){
    console.log(req.body.data);
    console.log('savestate');
    var id=req.params.id;   //update id
    var data={_id:mongojs.ObjectId(),name:req.body.data.name};
    var query={'_id':mongojs.ObjectId(id)};
    console.log(data);
    db.findOneAndUpdate(query,{$push:
    {states:data}
},function(err,res){
        if(err) throw err;
        console.log("Success");
    });
   // res.end("Success");
});

router.delete('/deleteCountry/:id',function(req,res){
    db.findByIdAndRemove(mongojs.ObjectId(req.params.id),function(err){
        if(err) res.send(err);
        else res.send({Message:'Success'});
    });
});

router.post('/delc',function(req,res){
    var query={'_id':mongojs.ObjectId(req.body.data._id)};
    db.findByIdAndRemove(mongojs.ObjectId(req.body.data._id),function(err){
        if(err) res.send(err);
        else
        res.send({Message:'Success'});
    });
});

module.exports = router;
