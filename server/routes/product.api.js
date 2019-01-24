var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongojs = require("mongojs"); //for data with mongodb
//var Mongo = require('mongodb');
var auth = require('../auth/auth');
var isodate = require("isodate");
var multer = require('multer');
var db = require('../model/product.js');
var fileupload = require('./upload.js');
//-------------------------------------------------Fileupload
var filename="";
var storage = multer.diskStorage({
  // destino del fichero
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  // renombrar fichero
  filename: function (req, file, cb) {
    filename = file.originalname;
    cb(null, filename);//file.originalname);
  }
});

var upload = multer({ storage: storage });
//------------------------------------------------------------------
router.get('/listCount', function (req, res) {
    db.find({}, function (err, docs) {
        if (err) throw err;
        // object of all the users
        //console.log(docs.length);
        res.end(JSON.stringify(docs.length));
    });
});
router.get('/list', function (req, res) {
    console.log('/product/list');
    db.find({},function (err, docs) {
        // console.log(docs);
        res.end(JSON.stringify(docs));
    });
});

router.post('/listpaging', function (req, res) {
    console.log('/product/listpaging');
    console.log(req.body.data);
    db.find({},function (err, docs) {
        // console.log(docs);
        res.end(JSON.stringify(docs));
    });

});


router.post('/Add',upload.array("uploads[]", 12), function (req, res) {
    console.log('product/Add--------------------------------------------');
    console.log(req.body);
    console.log('comming date :> '+req.body.st_date);
    console.log(isodate(new Date(req.body.st_date)));

    var data = {
        _id: mongojs.ObjectId(),
        st_date: req.body.st_date,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        avatar:filename
    };
    console.log(data);
    var _newrecord = new db(data);
    _newrecord.save(function (err, doc) {
        if (err) throw err;
        // console.log(res.result + " record updated");
        res.send({msg:'Success.'});
    });
    
});
router.put('/update', function (req, res) {
    //console.log(req.body.data);

    var id = req.body.data._id;
    var query = { "_id": mongojs.ObjectId(id) };
    var update = {
        st_date: req.body.data.st_date,
        name: req.body.data.name,
        description: req.body.data.description,
        price: req.body.data.price,
        avatar:req.body.data.avatar
        };
    // var options = { multi: true };
    //console.log('-------------------------Hello Query------------------------------------------' + mongojs.ObjectId(req.body.data._id));

    db.findOneAndUpdate(query, update, function (err, res) {
        if (err) throw err;
        //console.log(res.result + " record updated");
    });
    res.end('Success.');
});
router.delete('/Delete/:id', function (req, res) {
    //console.log(req.params.id);
    db.findByIdAndRemove(req.params.id, function (err,doc) {
        if (err)
            res.send(err);
            else{
                fs.exists('./uploads/' + doc.avatar, function (exists) {
                    if (exists) {
                        //Show in green
                        console.log('File exists. Deleting now ...');
                        fs.unlink('./uploads/' + doc.avatar,function(err1){});
                        
                    } else {
                        //Show in red
                        console.log('File not found, so not deleting.');
                    }
                });

                res.json({ message: 'Product removed from the locker!' });
            }
        
    });
});
router.delete('/DeleteMultiple/:ids', function (req, res) {
    console.log(req.params.ids);
    var _idsArray = req.params.ids.split(',');
    _idsArray.forEach(function (value) {

        console.log(value);

        db.findByIdAndRemove(value, function (err) {
            if (err)
                res.send(err);
        });
    });
    res.json({ message: 'data removed successfully' });
 });

 router.post('/Addproduct2',auth.ensureAuthenticated, upload.array("uploads[]", 12), function (req, res) {
     
    console.log('product/Add--------------------------------------------');
    console.log(filename);
  
   console.log(req.body);
    var data = {
        _id: mongojs.ObjectId(),
        st_date: req.body.st_date,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        avatar:filename
    };
    console.log(data);
    var _newrecord = new db(data);
    _newrecord.save(function (err, doc) {
        if (err) throw err;
        // console.log(res.result + " record updated");
        res.send({msg:'Success.'});
    });
    
});


//------------------------------------------------------------------------------------------------
router.post('/Addproduct3',auth.ensureAuthenticated,upload.array("uploads[]", 12),function(req,res){
  //-----------------------------------
    var data = {
        _id: mongojs.ObjectId(),
        st_date: req.body.st_date,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        avatar:filename
    };
    console.log(data);
    var _newrecord = new db(data);
    _newrecord.save(function (err, doc) {
        if (err) throw err;
        res.send({msg:'Success.'});
    });
});
//-------------------------------------------------------------------------------------------------
module.exports = router;