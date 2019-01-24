var app = require('express');
var router = app.Router();
var path = require('path');
var fs = require('fs');

//Get meeting data by userid
router.get('/read',function(req,res){

  var db = path.resolve(__dirname, '../../uploads/db.json');

  fs.readFile(db, function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    res.send(JSON.parse(data));

  });

});

router.get('/write',function(req,res){
  var db = path.resolve(__dirname, '../../uploads/db.json');

  fs.readFile(db,'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

  
    console.log(data);
    var result = JSON.parse(data);
    result.push({'id':'2','name':'randhir2'});
  
  fs.writeFile(db, JSON.stringify(result),'utf8', function (err) {
      if (err) return console.log(err);
      res.send({'msg':'success'});
    });
 
  });


});

////////////////////////
module.exports = router;