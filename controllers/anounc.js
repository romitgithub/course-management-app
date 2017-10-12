  var Anounc = require('../models/Anounc');
  var User = require('../models/User');
  var Course = require('../models/Course');
  var gcmController = require('./gcm');

  exports.index = function(req, res) {
    res.render('course');
  }

  exports.postannouncement = function(req, res) {
    var bdy = req.body;
  // console.log(bdy);
  var d = new Date();
  var n = d.getTime();

  console.log(req.body);
  User.findById(req.body.userid, function(err, userr) {
    if (userr) {

      var anounc = new Anounc({
        coursecode: req.body.coursecode,
        announcement: req.body.announcement,
        time: n,
        user: req.body.userid,
        username: userr.name
      });
      console.log(anounc);
      anounc.save(function(err) {
        if(err) {
          return next(err);
        } 
        else{

          Course.findOne({coursecode:bdy.coursecode}, function(err, course){
            if(course){
              followersArr = course.followersGCM;
              followersArr.splice(followersArr.indexOf(userr.gcmid), 1);
              console.log(followersArr);
              gcmController.sendNotification(followersArr, userr.name+' made some announcement in '+ bdy.coursecode+'.', 'announcement', bdy.coursecode, course.coursetitle);
              res.send({'msg': 'announcement done.','status': true});
            }
            else{
              res.send({'msg': 'announcement done, notification failed.','status': true});   
            }
          });
        }
      });
    }
  });
}

exports.getannouncement = function(req, res) {

  Anounc.find({
    coursecode: req.query.coursecode
  }, function(err, announcements) {
    if (announcements) {
      res.send({'announcements':announcements.reverse()});
  }
});
}

exports.deleteAnnouncement = function(req, res){
  var body = req.body;
  var userid = body.user_id;
  var announcId = body.announcement_id;

  Anounc.remove({user:userid, _id:announcId}, function(err, result){
    if(result){
      res.send({ 'status': true, 'message': 'Announcement removed successfully.' }); 
    }
    else{
      res.send({ 'status': true, 'message': 'Failed to remove announcement.' });    
    }
  });
}