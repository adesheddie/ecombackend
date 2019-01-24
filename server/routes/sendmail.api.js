var app = require('express');
var router = app.Router();
var path = require('path');
var nodemailer = require("nodemailer");
//var db = require('../model/index');
var auth = require('../auth/auth');
var officegen = require('officegen');
//var docx = officegen('docx');
var fs = require('fs');
var Templation  = require('nodemailer-templation');

var db = require('../model/meeting_invitation.js');



//Get meeting data by userid
router.get('/send',function(req,res){


  var userid=req.query.userid;
  var meeting_id=req.query.meeting_id;

 
//------------------------------------------------------------

var someFile = path.resolve(__dirname, '../../uploads/copyorder.html');
var someFile2 = path.resolve(__dirname, '../../uploads/copyorder.1.html');
fs.readFile(someFile, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var _htmlProducts = '<tr>'+
                      '<td><img src="http://cutfrycpanel.jsswebs.com/assets/images/product/product-1.png" alt="" width="220"></td>'+
                      '<td><h5 width="200" align="center">Product Name Here</h5></td>'+
                      '<td width="200" align="center">$270</td>'+
                      '<td width="100" align="center">1</td></tr>';
  var _address = '<tr><td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 0px 0px; color: #666666; font-family: Poppins, sans-serif; font-size: 14px; font-weight: 400; line-height: 25px;">'+
                        '<p><strong>Order will be delivered to: </strong></p>'+
                        '<p style="margin: 0;">Sandeep Tiwary<br>,'+ 
                          'H.NO-305 Pipaliwla Town Manimajra,Chandigarh <br>'+
                                'Chandigarh - 160101 <br>'+
                                 'CH <br>'+
                                '9888481772<br></p></td>'+
                         '<td bgcolor="#ffffff" align="right" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 0px 0px; color: #666666; font-family: Poppins, sans-serif; font-size: 14px; font-weight: 400; line-height: 25px;" width="400">'+
                       '<div>'+
                            '<p>Sub - Total amount  :  $3,592.00</p>'+
                             '<p>Tax (18%)  :  $646.56</p>'+
                             '<p>Shipping  :  $110.44</p>'+
                           '</div>'+
                           '<div class="total-payment">'+
                  '<h3><b>Total :</b> $4,349.00</h3>'+
                '</div></td></tr>';

  var result = data.replace('##USERNAME##', 'randhir').replace('##products##',_htmlProducts).replace('##address##',_address);
  
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
 
    //Send a mail using a template you've created, and listed under the templates option above. 
    Mailer.send({
      to: 'developer.randhir@gmail.com',
      subject: 'subject',
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
//------------------------------------------------------------
    res.send({'msg':'success'});
    //res.send(JSON.stringify(result));


});

router.post('/send',function(req,res){
console.log(req.body);
  var userid=req.query.userid;
  var meeting_id=req.query.meeting_id;
//------------------------------------------------------------

var someFile = path.resolve(__dirname, '../../uploads/copyorder.html');
var someFile2 = path.resolve(__dirname, '../../uploads/copyorder.1.html');
var userfullname='Curtfry';
var contactno='444444444';
fs.readFile(someFile, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var _htmlProducts = "";
  for(var i=0;i<req.body.ordereditem.length;i++){
   _htmlProducts += '<tr>'+
                      '<td><img src="http://cutfryadmin.jsswebs.com/fileupload/productthumb/'+req.body.ordereditem[i].thumbimage+'" alt="" width="220"></td>'+
                      '<td><h5 width="200" align="center">'+req.body.ordereditem[i].title+'</h5></td>'+
                      '<td width="200" align="center">$'+req.body.ordereditem[i].price+'</td>'+
                      '<td width="100" align="center">'+req.body.ordereditem[i].quantity+'</td></tr>';
  }
  var _address = '<tr><td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 0px 0px; color: #666666; font-family: Poppins, sans-serif; font-size: 14px; font-weight: 400; line-height: 25px;">'+
                        '<p><strong>Order will be delivered to: </strong></p>'+
                        '<p style="margin: 0;">'+userfullname+'<br>,'+ 
                        req.body.address.addressnamefirstl+'<br>'+
                        req.body.address.addressnamesecondl +'<br>'+
                        req.body.address.city+' -'+req.body.address.postcode+' <br>'+
                                 'CH <br>'+
                                 contactno+'<br></p></td>'+
                         '<td bgcolor="#ffffff" align="right" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 0px 0px; color: #666666; font-family: Poppins, sans-serif; font-size: 14px; font-weight: 400; line-height: 25px;" width="400">'+
                       '<div>'+
                            '<p>Sub - Total amount  :  $'+req.body.subtotal +'</p>'+
                            // '<p>Tax (18%)  :  $646.56</p>'+
                            // '<p>Shipping  :  $110.44</p>'+
                           '</div>'+
                           '<div class="total-payment">'+
                  '<h3><b>Total :</b> $'+req.body.total+'</h3>'+
                '</div></td></tr>';

  var result = data.replace('##USERNAME##', userfullname).replace('##products##',_htmlProducts).replace('##address##',_address);
  
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
 
    //Send a mail using a template you've created, and listed under the templates option above. 
    Mailer.send({
      to: 'developer.randhir@gmail.com',
      subject: 'subject',
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
//------------------------------------------------------------
    res.send({'msg':'success'});
    //res.send(JSON.stringify(result));


});

////////////////////////
module.exports = router;