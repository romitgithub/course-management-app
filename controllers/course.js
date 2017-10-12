var Course = require('../models/Course');
var User = require('../models/User');

var gcmController = require('./gcm');

exports.index = function(req, res) {
	res.render('course');
}

exports.postinsert = function(req, res) {
	var body = req.body;
	console.log(body);
  var followersArr = [];

  Course.findOne({coursecode: body.coursecode}, function(err, course){

      if(course){
        res.send({"msg" : "Course already exists", "status" : false});
      }
      else{

        var course = new Course({
          coursecode: body.coursecode,
          coursetitle: body.coursetitle,
          professor: body.prof,
          semester: body.semester,
          followers: followersArr
        });

        course.save(function(err) {
            if (err){
                res.send({"msg":"Failed to add course", "status":false});  
            } 
            res.send({"msg":"Succesfully Uploaded", "status":true});
        });
      }
  });
}

exports.addNewCourse = function(req, res) {
  var body = req.body;
  console.log(body);
  var followersArr = [];

  User.findOne({_id : req.query.user_id}, function(err, user){

      if(err || !user){
        res.send({'status':false, 'message':'failed to add course, no user exists'})
      }
      else {

          Course.findOne({coursecode: body.coursecode}, function(err, course){

          if(course){
            res.send({"msg" : "Course already exists", "status" : false});
          }
          else{

            var course = new Course({
              coursecode: body.coursecode,
              coursetitle: body.coursetitle,
              professor: body.professor,
              collegeid: body.college_id,
              followers: followersArr,
              followersGCM: followersArr,
              verified:false
            });

            course.save(function(err) {
                if (err){
                    res.send({"msg":"Failed to add course", "status":false});  
                } 
                else{
                    res.send({"msg":"Succesfully Uploaded", "status":true});
                }
            });
          }
      });
    }
  });
}

exports.verifyCourse = function(req, res){
  var body = req.body;
  var coursecode = 'PSY451';

  Course.findOne({coursecode: coursecode}, function(err, course){

      if(course){
        if(course.verified){
            res.send({"msg":"course already verified", "status":false});  
        }
        else{

            course.verified = true;
            course.save(function(err){
              if (err){
                  res.send({"msg":"Failed to verified course", "status":false});  
              } 
              else{
                  res.send({"msg":"course verified", "status":true});
              }
            });
        }
      }
      else{
        res.send({"msg":"Failed to verified course", "status":false});  
      }
  })
}

exports.send = function(req, res){
  var coursecode = [req.query.coursecode];

  // gcmController.sendNotification(gcmId, 'Your uploaded course PHY103 has been added.', 'course_added', 'PHY103');
  Course.findOne({coursecode:coursecode}, function(err, course){
        if(course){
            followersArr = course.followersGCM;
            console.log(followersArr);
        }
        return followersArr;
    })
}


exports.getAllCourseCodes =  function(req, res){
  var body = req.body;
  var userid = body.user_id;
  var collegeid = body.college_id;

  User.findOne({_id : userid, collegeid: collegeid}, function(err, user){

      if(err || !user){
        res.send({'status':false, 'message':'failed to get course list, no user exists'});
      }  
      else{
        Course.find({verified:true, collegeid:collegeid},  {coursecode:1}, function(err, coursecodes){
          if(coursecodes){
            res.send({'status':true, coursecodes:coursecodes});
          }
          else{
            res.send({'status':false, 'msg':'Failed to get the list of all coursecodes'});
          }
        });
      }
  })
}

exports.searchCourses = function(req, res){
  var body = req.body;
  var userid = body.user_id;
  var collegeid = body.college_id;
  var searchKey = body.text;
  var coursecodeText = "/"+searchKey+"/i";

  var check = [];
  var coursecodeQuery = {coursecode: new RegExp(searchKey, "i")};
  check.push(coursecodeQuery);

  if(searchKey.length>1){
    var coursetitleQuery = {coursetitle: new RegExp(searchKey, "i")};
    check.push(coursetitleQuery);
  }

  User.findOne({_id : userid}, function(err, user){

      if(err || !user){
        res.send({'status':false, 'message':'failed to get course list, no user exists'});
      }
      else{
        Course.find({$or:check, verified:true, collegeid:user.collegeid}, {_id:0,coursecode:1,coursetitle:1}, function(err, courses){
          if(courses){
            res.send({'status':true, coursecodes:courses});
          }
          else{
            res.send({'status':false, 'msg':'Failed to get the list of all coursecodes'}); 
          }
        })
      } 
  }) 
}
