
var Course = require('../models/Course');
var User = require('../models/User');

var gcmController = require('./gcm');

exports.runScheduler =  function(req, res){
  var d = new Date();
  var t1 = d.getHours()+6;
  t1 = t1%6;
  var t2 = d.getMinutes()+30;
  t2 = t2%60;
  var t3 = d.getDay();

 var obj = {};
 obj.day = t3;
 obj.hour = t1;
 obj.minutes = t2;

  Course.find({timetable : { $exists: false }, verified:true}, function(err, course){
      if(err){
        res.send({'status':false, 'message':'failed to get courses list'});
      }  
      else{
        for (var i = course.length - 1; i >= 0; i--) {
            if(course[i]){
              var j;
              for (j = 0; j < course[i].timetable.length; j++) {
                  if (course[i].timetable[j] === obj) {
                       var followersArr = course[i].followersGCM;
                        console.log(followersArr);
                        var message = 'class after 15 mins';
                        gcmController.sendNotification(followersArr, message, 'classtime', course[i].coursecode, course[i].coursetitle);
                        break;
                  }
              }
             
              // res.send({'msg': 'announcement done.','status': true});
            }
            else{
              res.send({'msg': 'announcement done, notification failed.','status': true});   
            }
        };
        res.send({'msg': 'announcement done.','status': true});
      }
  })

}


exports.runSchedulercheck =  function(req, res){
 

 

  Course.find({coursecode: 'AE322A' ,verified:true}, function(err, course){
      if(err){
        res.send({'status':false, 'message':'failed to get courses list'});
      }  
      else{
        for (var i = course.length - 1; i >= 0; i--) {
            if(course[i]){
              var followersArr = course[i].followersGCM;
              console.log(followersArr);
              var message = 'class after 15 mins';
              gcmController.sendNotification(followersArr, message, 'classtime', course[i].coursecode, course[i].coursetitle);
              // res.send({'msg': 'announcement done.','status': true});
            }
            else{
              res.send({'msg': 'notification failed.','status': true});   
              
            }
        };
        res.send({'msg': 'announcement done.','status': true});
      }
  })

}


exports.getInputTime = function(req, res){
  Course.find({hour : { $exists: false }, minutes: { $exists: false }, verified:true}, function(err, course){
      if(err){
        res.send({'status':false, 'message':'error'});
      }  
      else{
        res.render('timetable', {
             'courses': courses,
             'courseslength': courses.length
        });
      }
  })
}

exports.postInputTime = function(req, res){
    var body = req.body;
    Course.findOne({coursecode: body.coursecode}, function(err, course){
      if(!course){
        res.send({"msg" : "Course does not exist", "status" : false});
      }
      if (course) {
                        if(!course.timetable){
                           course.timetable = [];
                       }
                       course.timetabe.push({
                        "hour": body.hour,
                        "minutes": body.minutes,
                        "day": body.day
                    })
                  }
      
                  course.markModified('timetable');
                   course.save(function(err) {

                    if (err) return res.send(
{
                        'status': false
                    });
                    res.send({"msg":"Succesfully Updated time", "status":true});
      
  }); 



})
}
