var multer = require('multer'); //for fileupload
var fs = require('fs');
var filename = "";
var _filename1 = "";
module.exports = {
 uploadFnct:function (dest) {
    console.log("file upload called & Below is dest : ");

     console.log(dest);
     var storage = multer.diskStorage({
        // destino del fichero
        destination: function (req, file, cb) {
          cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            filename = file.originalname;
            console.log(filename);
            cb(null, filename);//file.originalname);
          }
    });
    var upload =  multer({ storage: storage }).single('userfile');
  //console.log(upload);
    return upload;
}
// newfilename:function()
// {
//     return _filename;
// }
}