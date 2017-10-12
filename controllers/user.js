var express = require('express');
var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var secrets = require('../config/secrets');
var gcm = require('node-gcm');

var request = require('request');


var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var Course = require('../models/Course');
var Forum = require('../models/Forum');
var secrets = require('../config/secrets');
var College = require('../models/College');
var CollegeRequest = require('../models/CollegeRequest');
/**
 * GET /login
 * Login page.
 */

exports.country = function(req,res){
  var name = req.query.name;
  
  if(name.toString() === "InterviewStreet"){
    res.send({
      'country' : ["HackerRank"]
    });
  }
  else{
      res.send({
    'country' :  ["Australia","America","Japan","China","Germany","Spain"]
  });
}
};

exports.capital = function(req,res){
  var country = req.query.country;
  if(country.toString() === "HackerRank"){
    res.send({
      'capital' : "Bangalore"
    });
  }
  else{
    switch(country.toString()){
      case "Australia" :
      res.send({
        'capital' : "Sydney"
      });
      break;
      case "America" :
      res.send({
        'capital' : "Washington DC"
      });
      break;
      case "Japan" :
      res.send({
        'capital' : "Tokyo"
      });
      break;
      case "China" :
      res.send({
        'capital' : "Beijing"
      });
      break;
      case "Germany" :
      res.send({
        'capital' : "Berlin"
      });
      break;
      case "Spain" :
      res.send({
        'capital' : "Madrid"
      });
      break;
      default:
      res.send({
        'capital' : "error"
      });
    }
  }
};

exports.getLogin = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/login', {
    title: 'Login'
  });
};

exports.checklogin = function(req, res) {
  if (req.user) {
    res.send({
      "status": true
    });
  } else {
    res.send({
      "status": false
    });
  }

};

/**
 * POST /login
 * Sign in using email and password.
 */
 exports.postLogin = function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash('errors', {
        msg: info.message
      });
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err){
        res.send({'status': false, 'message':'Oops, Either email or password is incorrect.'})
      }
      else{
        res.send({'user':user, 'courses': user.courses,'status':true});
      }
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
 exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
// exports.getSignup = function(req, res) {
//   if (req.user) return res.redirect('/');
//   res.render('account/signup', {
//     title: 'Create Account',
//     email: ""
//   });
// };

/**
 * GET /homesignup
 * Signup page with email id filled
 */
// exports.homeSignup = function(req, res) {
//   if (req.user) return res.redirect('/');
//   res.render('account/signup', {
//     title: 'Create Account',
//     email: req.query.email
//   });
// };


/**
 * POST /signup
 * Create a new local account.
 */
 exports.postSignup = function(req, res, next) {
  var coursesArr = [];
 console.log(req.body);
 var user = new User({
    email: req.body.user_email,
    password: req.body.password,
    name: req.body.user_name,
    gender:req.body.user_gender,
    college: req.body.user_college,
    year: parseInt(req.body.user_year),
    branch: req.body.user_branch,
    program: req.body.user_program,
    courses: coursesArr,
    questions:coursesArr,
    answers:coursesArr,
    imagepath: "",
    gcmid:""
  });

 console.log(user.college);
  College.findOne({college:user.college}, function(err, college){

    console.log(college);
    if(college){

      User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) 
        {
          res.send({'status':false,'message': 'user already exists'});
        }
        else{
          user.collegeid = college.id;
          user.save(function(err) {

            if (err){
              res.send({'status':false,'message': 'failed to add user, please try again'});    
            }
            else{
              req.logIn(user, function(err) {
                if (err) return next(err);
                res.send({'status':true,'user': user});
              });
            }
          });
        }
      });
    }
    else{
	console.log(err);
      res.send({'status':false,'msg': 'College isn\'t registered.'});
    }
  });
};

exports.addCourse = function(req, res) {

  var body = req.body;
  var userid = body.user_id;
  var coursecode = body.coursecode;

  User.findById(userid, function(err, userr) {
    if (userr) {

      if(userr.courses.indexOf(coursecode) > -1){
        res.send({ 'status' : false, 'message': 'Course already added' });
      }
      else{
        userr.courses.push(coursecode);
        userr.save(function(err) {

          if (err) 
            { res.send({ 'status' : false, 'message': 'Cant add course' }); }
          else
          {

            Course.update({coursecode:coursecode}, {$push:{followers:userid, followersGCM:userr.gcmid}}, function(err, course){
              if(course)
              {

                res.send({ 'status': true, 'message': 'course added successfully' });

              }
              else{
                res.send({ 'status': false, 'message': 'failed to add course' }); 
              }
            });  
          }
        });
      }
    }
    else
    {
      res.send({ 'status': false, 'message': 'cant find user' }); 
    }
  });
}

exports.removeCourse = function(req, res){

  var body = req.body;
  var userid = body.user_id;
  var gcmid = body.gcm_id;
  var coursecode = body.coursecode;

  User.update({ _id: userid },{ $pull: { courses: coursecode }},function(err, user){
      if(err){
        res.send({'status': false})
      }
      else{
        Course.update({coursecode:coursecode}, {$pull:{followers:userid}}, function(err, course){
          if(course){
            Course.update({coursecode:coursecode}, {$pull:{followersGCM:gcmid}}, function(err, courser){
              if(courser){
                res.send({'status': true})
              }
              else{
                res.send({'status': false})    
              }
            })
          }
          else{
            res.send({'status': false})
          }
        })
      }
    })
}

exports.gcm = function(req, res){
  // var gcm = require('node-gcm');

  var message = new gcm.Message();

  message.addData('message');

  var regIds = [admin_GCM_ID];

  var sender = new gcm.Sender('AIzaSyC_0lcCf28lgrOxtXoJTIVPEA4ivgXxTFw');

  sender.send(message, regIds, function (err, result) {
    if(err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
}

exports.allcourses1 = function(req, res) {

  User.findById(req.body.user_id, function(err, userr) {
    if (userr) {
      Course.find({verified:true, collegeid:userr.collegeid}, function(err, courses) {
        if(err){
          res.send({'status': false});  
        }
        else{
          res.send({'status': true, 'courses': courses});
        }
      });
    }
    else{
      res.send({'status': false});
    }
  });
}



exports.updateGCMId = function(req,res){
  var body = req.body;
  var gcmid = body.gcm_id;
  var userid = body.user_id;
  var logout = body.logout;
  var result;
  var oldgcm;

  User.findOne({_id:userid}, function(err, user){

    if(user){

      if(!logout){

        oldgcm = user.gcmid;
        user.gcmid = gcmid;

        user.save(function(err){
          if(err){
            res.send({'status':false, 'msg':'failed to update gcmid'});
          }
          else{
            Course.update({coursecode:{$in:user.courses}}, {$push:{followersGCM: gcmid}}, function(err, gcmupdate){
              if(err){
                res.send({'status':false, 'msg':'failed to update gcmid'});       
              }
              else{
                Course.update({coursecode:{$in:user.courses}}, {$pull:{followersGCM: oldgcm}}, function(err, gcmupdate){
                  if(err){
                    res.send({'status':false, 'msg':'failed to update gcmid'});       
                  }
                  else{

                    Forum.update({_id:{$in:user.questions}}, {$push:{followersGCM: gcmid}}, function(err, questionUpdate){
                      if(err){
                        res.send({'status':false, 'msg':'failed to update gcmid'});       
                      }
                      else{
                        Forum.update({_id:{$in:user.questions}}, {$pull:{followersGCM: oldgcm}}, function(err, questionUpdate){
                          if(err){
                            res.send({'status':false, 'msg':'failed to update gcmid'});       
                          }
                          else{
                            res.send({'status':true, 'msg':'updates successfully'});       
                          }
                        });
                      }
                    });
                  }
                });
              }
          });
        }
    });
  }
  else{
    oldgcm = user.gcmid;
    user.gcmid = "";

    user.save(function(err){
      if(err){
        res.send({'status':false, 'msg':'failed to update gcmid'});
      }
      else{
        Course.update({coursecode:{$in:user.courses}}, {$pull:{followersGCM: oldgcm}}, function(err, gcmupdate){
          if(err){
            res.send({'status':false, 'msg':'failed to update gcmid'});       
          }
          else{
            Forum.update({_id:{$in:user.questions}}, {$pull:{followersGCM: oldgcm}}, function(err, questionUpdate){
              if(err){
                res.send({'status':false, 'msg':'failed to update gcmid'});       
              }
              else{
                res.send({'status':true, 'msg':'updates successfully'});       
              }
            });  
          }
        });
      }
    });
  }
}
else{
  res.send({'status':false, 'msg':'cant find user'});
}
}); 
}

exports.all_Course = function(req, res) {

  Course.find({}, function(err, courses) {
        // console.log(courses);
        res.send({'courses': courses});
      });

};





exports.showuser = function(req, res, next) {
  if (req.query.id) {
    User.findOne({
      _id: req.query.id
    }, function(err, user) {
      if (err) return next(err);
      delete user.password;
      delete user.tokens;
      res.send(user);
    });
  } else {
    res.send({
      success: false
    })
  }
};


exports.addCollege = function(req, res){
  var body = req.body;
  var city = body.location;
  var college = body.college;
  var email = body.email;

  var college = new CollegeRequest({email:email, city:city, college:college });

  college.save(function(err, collegeResult){
    if(collegeResult){
      res.send({'status':true, 'message': 'Course added successfully.'});
    }
    else{
      res.send({'status':false, 'message': 'Something went wrong, Please try again'});
    }
  })
}


/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
 exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) {
      return token.kind === provider;
    });

    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', {
        msg: provider + ' account has been unlinked.'
      });
      res.redirect('/account');
    });
  });
};


exports.authenticate = function(req, res, next) {

  var url = 'https://login.live.com/oauth20_authorize.srf?client_id=000000004C177DFE&scope=wl.signin%20wl.basic&response_type=code&display=touch&redirect_uri=http%3A%2F%2Fwww.romitchoudhary.com';
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
    else{
      res.send('aaa');
    }
  })
}
