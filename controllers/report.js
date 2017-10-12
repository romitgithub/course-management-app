  var Anounc = require('../models/Anounc');
  var User = require('../models/User');
  var Course = require('../models/Course');
  var Report = require('../models/Report');

  exports.index = function(req, res) {
    res.render('reports');
  }

  exports.postReport = function(req, res) {
    var bdy = req.body;

    var d = new Date();
    var n = d.getTime();

    User.findById(req.body.user_id, function(err, userr) {
      if (userr) {
        Report.find({objectid: req.body.object_id, userid: req.body.user_id}, function(err, report){
          if(report){
            res.send({'msg': 'Already Reported','status': false});;
          }
          else{
            var repo = new Report({
              objectid: req.body.object_id,
              type: req.body.type,
              time: n,
              userid: req.body.user_id
            });
            repo.save(function(err) {
              if(err) {
                res.send({'msg': 'Error','status': false});;
              } 
              else{
                res.send({'msg': 'reported','status': true});               
              }
            });
          }
        });
      }
      else{
        res.send({'msg': 'Error','status': false});;
      }
    });
  }

