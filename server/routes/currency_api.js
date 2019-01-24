var app=require('express');
var router=app.Router();
var mongojs=require('mongojs');
var auth = require('../auth/auth');
var User = require('../model/user.js');
var currency=require('../model/currencyModel.js');

/* Save currency */
router.post('/save',auth.ensureAuthenticated,function(req,res){
	   User.findById(req.user, function (err, user) {
    //  if(user.role==="admin")
    //  {   
	    var data={
		            currency_name:req.body.currency_name,
		            status:req.body.status,
                currency_code:req.body.currency_code,
                currency_symbol_left:req.body.currency_symbol_left,
                currency_symbol_right:req.body.currency_symbol_left,//req.body.currency_symbol_right,
                country_id:req.body.country_id,
                userid:user._id
              };
           var _newdata = new currency(data);
               _newdata.save(function(err,result){
           if(err){
	              res.status(500).send({message:err.message})
                   }
                  res.send({message:"success"});
                 });
              //   }
              // else
              //  {
              //  res.status(500).send({ message: "You are not allowed" }); 
              //   }
                 }); 
            });
/* Get all currency */

router.get('/getcurrency',auth.ensureAuthenticated,function(req,res){
	 User.findById(req.user, function (err, user) {
    //  if(user.role==="admin")
    //  {   
	       currency.find({},function(err,result){
		      if(err){
		        req.status(500).send({message:err.message});
	          }
	         res.send(result);
		       });
    // }
    //  else
    //   {
    //     res.status(500).send({ message: "You are not allowed" }); 
    //   }
    });
});

/* Get currency with id*/

router.get('/getcurrency/:id',auth.ensureAuthenticated,function(req,res){
  User.findById(req.user, function (err, user) {
   //  if(user.role==="admin")
   //  {   
        currency.find({'_id':mongojs.ObjectId(req.params.id)},function(err,result){
         if(err){
           req.status(500).send({message:err.message});
           }
          res.send(result);
          });
   // }
   //  else
   //   {
   //     res.status(500).send({ message: "You are not allowed" }); 
   //   }
   });
});

/* Delete currency */

	router.delete('/delete_currency/:id',auth.ensureAuthenticated,function(req,res) {
		  User.findById(req.user, function (err, user) {
        //    if(user.role==="admin")
        //  { 
           var id = req.params.id;
         currency.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
              if (err) {
                         req.status(500).send({message:err.message});
                       }
                   res.send({message:"success"});
             });
    //      }
    //  else
    //   {
    //     res.status(500).send({ message: "You are not allowed" }); 
    //   }
  });
});
///Update currency
router.put('/update_currency/:id',auth.ensureAuthenticated,function(req,res){
	  User.findById(req.user, function (err, user) {
      // if(user.role==="admin")
      //  { 
			var id = req.params.id;
			var query = { "_id":mongojs.ObjectId(id) };
			var update={
				       currency_name:req.body.currency_name,
                status:req.body.status,
                currency_code:req.body.currency_code,
                currency_symbol_left:req.body.currency_symbol_left,
                currency_symbol_right:req.body.currency_symbol_right,
                country_id:req.body.country_id,
                updated:new Date(),
                userid:user._id
			};
			var options = { new: true };
			currency.findOneAndUpdate(query, update, options, function (err, doc) {
				if (err) {
					 req.status(500).send({message:err.message});
				}
      res.send({message:"success"});
			});
    //      }
    //  else
    //   {
    //     res.status(500).send({ message: "You are not allowed" }); 
    //   }
		   });	
		});
/*insert currency value */
 router.put("/save_currency_value/:id",auth.ensureAuthenticated, function (req, res) {
  User.findById(req.user, function (err, user) {
      // if(user.role==="admin")
      //  { 
    var id = req.params.id;
    var data={
      currency_price:req.body.currency_price,
      currency_status:req.body.currency_status,
      created:new Date()
    };
    var query = {"_id": mongojs.ObjectId(id) };
   currency.findOneAndUpdate(query,{$push:{currency_value:data}}, function (err, doc) {
        if (err) {
              res.status(500).send({ message: err.message });
        }
         res.send({message:"success"});
    });
    //   }
    //  else
    //   {
    //     res.status(500).send({ message: "You are not allowed" }); 
    //   }
       });
     });
 /* Edit Currency value */
router.get("/edit_currency_value/:id",auth.ensureAuthenticated, function (req, res) {
   User.findById(req.user, function (err, user) {
      if(user.role==="admin")
       { 
    console.log("i am in currency value edit");
    var id = req.params.id;
    //console.log(id);
    currency.find({"currency_value._id":mongojs.ObjectId(id)},{"currency_value.$": true}, function (err, doc) {
        if (err) {
                            res.status(500).send({ message: err.message });
                        }
                        res.send(doc);
    });
    }
     else
      {
        res.status(500).send({ message: "You are not allowed" }); 
      }
       });
});

/* Delete Currency value */

router.delete('/delete_currency_value/:id',auth.ensureAuthenticated, function (req, res) {
   User.findById(req.user, function (err, user) {
      // if(user.role==="admin")
      //  { 
    var id = req.params.id;
   currency.findOne({'currency_value._id': mongojs.ObjectId(id)}, function (err, result) {
    if (err) {
                            res.status(500).send({ message: err.message });
                         }
        result.currency_value.id(id).remove();
        result.save(); 
       res.send({message:"success"});         
    });
  //  }
  //    else
  //     {
  //       res.status(500).send({ message: "You are not allowed" }); 
  //     }
       });
});

/* Update Currency value */

router.put("/update_currency_value/:id",auth.ensureAuthenticated, function (req, res) {
  console.log('currency Update');
  // User.findById(req.user, function (err, user) {
    // if(user.role==="admin")
    //    { 
     var id = req.params.id;
    // currency.findOne({'currency_value._id': id}, function (err, result) {
    // if (err) {
    //             res.status(500).send({ message: err.message });
    //           }
    //     result.currency_value.id(id).currency_price=req.body.currency_price;
    //     result.currency_value.id(id).currency_status=req.body.currency_status;
    //     result.currency_value.id(id).updated=new Date();
    //     result.save(); 
    //     res.send({message:"success"});           
    // });
    try{
    currency.update(
      {'currency_value._id': id},
      { $set: { "currency_value.$[elem].currency_price" : req.body.currency_price } },function(err,doc){

        res.send(doc);
      })
    }
    catch (ex){
      console.log('================Error');
      console.log(ex.message);
    }
    //   }
    //  else
    //   {
    //     res.status(500).send({ message: "You are not allowed" }); 
    //   }
      // });
     });
module.exports=router;