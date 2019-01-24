const express = require('express');
const app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
app.options('*', cors())
//app.set('case sensitive routing', true);
// mongoose
//var moment = require('moment');
//mongoose.connect('mongodb://localhost/ecomdb');


mongoose.connect('mongodb://ecom123:ecom123@ds042898.mlab.com:42898/ecom1');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'Content-Type','Authorization');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    next();
});

//req.connection.remoteAddress
var tlog = require('./server/routes/activitylogsave.js');
tlog.TrackLog({activityname:'Home',ipaddress:'12.2.33.44',comment:'View Home Page',user_id:'5b9ce56a22ee343680ae2ec7'});

       
var productroutes = require('./server/routes/product.api.js');
app.use('/product', productroutes);
app.use('/country', require('./server/routes/country.api.js'));

var userroutes = require('./server/routes/user.api.js');
app.use('/user', userroutes);

app.use('/mails', require('./server/routes/sendmail.api.js'));
app.use('/file', require('./server/routes/fileprocess.js'));
app.use('/log', require('./server/routes/activitylog.api.js'));
app.use('/currency', require('./server/routes/currency_api.js'));

app.get('/',function(req,res){
    console.log(req);
    res.send('Ecom Backend Running...' + req.connection.remoteAddress);
})
app.listen(process.env.PORT || 3001);

console.log('http://localhost:3001/');
