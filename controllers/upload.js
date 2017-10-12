    var express = require('express');

    var File = require('../models/File');
    var multer = require('multer');
    var upload = multer({ dest: 'public/uploads/'});
    var User = require('../models/User');
    var Course = require('../models/Course');
    var fs = require('fs');
    var AWS = require("aws-sdk");
    // console.log(File);

    var secrets = require('../config/secrets');

    var gcmController = require('./gcm');

    /* GET upload listing. */
    exports.index = function(req, res) {
      res.render('upload');
  };

  exports.uploadimg = function(req, res, next){
   console.log("asd");
   upload.single('file');
   console.log("qwe");
};


exports.multiFileUploads = function(req, res, next){
    console.log(req.files.files);
    console.log(req.body);
    var body = req.body;
    var filesArr = req.files.files;
    var filesArrToSave = [];
    var followers;
    var userid, username, fileId;

    if(Array.isArray(filesArr)){

        for (var i = 0; i < filesArr.length; i++) {
            s3Upload(filesArr[i].path, filesArr[i].name, getContentTypeByFile(filesArr[i].name));
            var singleFile = {};
            singleFile.filetype = filesArr[i].extension;
            singleFile.filesize = filesArr[i].size;
            singleFile.path = 'http://46.101.204.227:8080/share-server-client/public/uploads/'+filesArr[i].name;

            filesArrToSave.push(singleFile);
        };
    }
    else{
        s3Upload(filesArr.path, filesArr.name, getContentTypeByFile(filesArr.name));
        var singleFile = {};
        singleFile.filetype = filesArr.extension;
        singleFile.filesize = filesArr.size;
        singleFile.path = 'http://46.101.204.227:8080/share-server-client/public/uploads/'+filesArr.name;
        filesArrToSave.push(singleFile);
    }


    var d = new Date();
    var n = d.getTime();

    var k = {};

    if(req.body.user_id){
        User.findOne({ _id: req.body.user_id }, function(err, existingUser) {
            if (existingUser)
            {
                k.coursecode = body.coursecode;
                k.category = body.category;
                k.description = body.desc;
                k.files = filesArrToSave;
                k.time = n;
                k.uploadedby = existingUser._id;
                k.uploader = existingUser.name;

                var file = new File(k);

                file.save(function(err, fileSaved) {
                    if (err){
                        return res.send({'status': false});
                    }
                    else{
                        fileId = fileSaved.id;
                        Course.findOne({coursecode:body.coursecode}, function(err, course){
                            if(course){
                                followersArr = course.followersGCM;
                                followersArr.splice(followersArr.indexOf(existingUser.gcmid), 1);
                                console.log(fileSaved.id);
                                console.log(followersArr);
                                gcmController.sendNotification(followersArr, existingUser.name+' uploaded a new file in '+ body.coursecode+' '+body.category+'.', 'upload', body.coursecode, fileSaved.id);
                                res.send({'msg': 'File has been uploaded.','status': true});
                            }
                            else{
                                res.send({'msg': 'File has been uploaded, notification failed.','status': true});
                            }
                        });
                    }
                });
            }
        });
    }
}

exports.postUpload = function(req, res){
    	// console.log(req);
    	console.log("entered");
    	console.log(req.user);
    	console.log(req.body);
    	console.log(req.files);
        var userName = req.user.name;

        var filesArr = req.files.file;
        var filesArrToSave = [];

        for (var i = 0; i < filesArr.length; i++) {
            var singleFile = {};
            singleFile.filetype = filesArr[i].extension;
            singleFile.filesize = filesArr[i].size;
            singleFile.path = 'uploads/'+filesArr[i].name;

            filesArrToSave.push(singleFile);
        };

        var bdy = req.body;
        var d = new Date();
        var n = d.getTime();
        var courseCode = bdy.dept + bdy.coursecode;

        var k = {
        	coursecode: bdy.dept + bdy.coursecode,
        	category: bdy.category,
        	description: bdy.desc,
        	year: bdy.year,
        	professor: bdy.prof,
        	files: filesArrToSave,
        	time: n
        };

        if(req.user){
        	k.uploadedby = req.user._id;
        	k.uploader = req.user.name;
        }
        else if(req.body.userid){
        	User.findOne({ _id: req.user._id }, function(err, existingUser) {
              if (existingUser)
              {

                k.uploadedby = req.existingUser._id;
                k.uploader = req.existingUser.name;
            }
        });
        }

        console.log(k);

        var file = new File(k);

        file.save(function(err, filesaved) {

            if (err) return res.send({
                'status': false
            });
                else{

                    Course.findOne({coursecode:courseCode}, function(err, course){
                        if(course){
                            followersArr = course.followersGCM;
                            console.log(filesaved);
                            gcmController.sendNotification(followersArr, userName+' uploaded a new file in '+ courseCode+' '+bdy.category+'.', 'upload', courseCode);
                            res.send({'msg': 'File has been uploaded.','status': true});
                        }
                        else{
                            res.send({'msg': 'File has been uploaded, notification failed.','status': true});
                        }
                    });
                }

            });
    }


    exports.post_Upload = function(req, res){
    	var bdy = req.body;
    	var d = new Date();
        var n = d.getTime();
        var k = {
        	filetype: req.files.file.extension,
        	filesize: req.files.file.size,
        	path: 'uploads/'+req.files.file.name,
        	time: n
        };

        console.log(k);

        var file = new File(k);

        file.save(function(err) {

            if (err) return res.send({
                'status': false
            });

                File.findOne({
                  path: k.path
              }, function(err, file_) {
                  if (file_) {
                    res.send({
                      'fid': file_._id,
                      'status': true
                  });
                }
            });
            });

    };

    exports.update_Upload = function(req, res){
    	var bdy = req.body;
    	console.log(bdy);
    	var a;
    	var b;

      User.findById(req.body.userid, function(err, existingUser) {
         if (existingUser) {
            console.log(existingUser);
    			      // a = req.existingUser._id;
    			      b = existingUser.name;
    			     //  file.uploadedby = req.existingUser._id;
    	    			// file.uploader = req.existingUser.name;
                 }

             });

    	 // User.findOne({
    		//     _id: req.body.userid
    		//   }, function(err, existingUser) {
    		//     if (existingUser) {
    		//       k.uploadedby = req.existingUser._id;
      //   			k.uploader = req.existingUser.name;

    		//     }

    		//   });
    console.log(req.body.userid);

    File.findById(req.body.fid, function(err, file) {
        console.log("entered");
        console.log(file);
        file.coursecode = bdy.coursecode;
        file.description = bdy.desc;
        file.year = parseInt(bdy.year);
        file.professor = bdy.prof;
        file.category = bdy.category;
        file.uploadedby = req.body.userid;
        file.uploader = b;


        console.log(file);

        file.save(function(err) {
            if (err) return next(err);
            res.send({
                'status': true
            });
        });
    });
};


exports.getSearch = function(req, res) {
    res.render('search');
};

exports.getSearch_ = function(req, res) {
   var check = {};
   User.findOne({_id:req.body.user_id}, function(err, user){
       if(user){
        if (req.body.coursecode) {
            check.coursecode = req.body.coursecode;
        }
        if (req.body.filetype) {
            check.filetype = req.body.filetype;
        }
        if (req.body.category) {
            check.category = req.body.category;
        }
        if (req.body.year) {
            check.category = req.body.year;
        }
        File.find(check, function(err, files) {
            files.reverse();
            res.send({'files': files});
        });
    }
    else{
        res.send({'status':false, 'msg':'no user'});
    }


});

}

exports.getFileModel=function(req,res){
    var body = req.body;
    var userid = body.user_id;
    var fileId = body.upload_id;
    console.log(body);
    console.log(userid);
    console.log(fileId);
    User.findOne({_id:userid}, function(err, user){
    console.log("hereeee111");
    if(user){
            File.findById(fileId, function(err, file){
                console.log("hereee2222");
		if(file){
			console.log("hereee333");
                    res.send({'status':true, 'upload_model': file});
                }
                else{
                    res.send({'status':false, 'msg':'failed to get file'});
                }
            })
        }
        else{
            res.send({'status':false, 'msg':'failed to get file'});
        }
    });
}

exports.deleteUpload = function(req, res){
    var body = req.body;
    var userid = body.user_id;
    var uploadId = body.upload_id;

    File.remove({uploadedby:userid, _id:uploadId}, function(err, result){
        if(result){
            res.send({ 'status': true, 'message': 'Upload removed successfully.' });
        }
        else{
            res.send({ 'status': true, 'message': 'Failed to remove Upload.' });
        }
    });
}

function getCourseFollowers(coursecode){

    var followersArr = [];

    Course.findOne({coursecode:coursecode}, function(err, course){
        if(course){
            followersArr = course.followersGCM;
            console.log(followersArr);
        }
        return followersArr;
    })
}

function s3Upload(filepath, filename, contentType){
    AWS.config.update({ accessKeyId: secrets.AWSAccessKeyId, secretAccessKey: secrets.AWSSecretKey });
        // var filepath = '/home/romit/share-server-client/public/uploads/0959a9bd4110ba372ef629b8b25a7365.jpg';

        fs.readFile(filepath, function (err, data) {
          if (err) { throw err; }

          var base64data = new Buffer(data, 'binary');

          var s3obj = new AWS.S3({params: {Bucket: 'osmos-android-bucket', Key: filename, ACL: 'public-read', ContentType:contentType}});
          s3obj.upload({Body: data}).
          on('httpUploadProgress', function(evt) { console.log(evt); }).
          send(function(err, data) { console.log(err, data) });

      });
    }


    exports.updateUser = function(req, res){

      var body = req.body;
      var userid = body.user_id;
      var files = req.files.files;
      console.log(files);
      var path;


      User.findOne({_id: userid}, function(err, user){

        if(user){
            s3Upload(files.path, files.name, getContentTypeByFile(files.name));
            path = 'http://46.101.204.227:8080/share-server-client/public/uploads/'+files.name;;
            user.imagepath = path;
            user.save(function(err){
              if(err){
                console.log("test");
                res.send({ 'status': false, 'message': 'failed to update profile'});
              }
            else{
                console.log("test");
                res.send({ 'status': true, 'message': path});
              }
            })
        }
        else{
          console.log("test");
          res.send({ 'status': false, 'message': 'failed to update profile'});
        }
      });
    }


function getContentTypeByFile(fileName) {
  var rc = 'application/octet-stream';
  var fn = fileName.toLowerCase();

  if (fn.indexOf('.html') >= 0) rc = 'text/html';
  else if (fn.indexOf('.css') >= 0) rc = 'text/css';
  else if (fn.indexOf('.json') >= 0) rc = 'application/json';
  else if (fn.indexOf('.js') >= 0) rc = 'application/x-javascript';
  else if (fn.indexOf('.png') >= 0) rc = 'image/png';
  else if (fn.indexOf('.jpg') >= 0) rc = 'image/jpg';

  return rc;
}
