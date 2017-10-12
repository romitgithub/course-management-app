    var express = require('express');

    var Forum = require('../models/Forum');
    var User = require('../models/User');
    // var multer = require('multer');
    // var upload = multer({ dest: 'public/uploads/'});
    var gcmController = require('./gcm');


    /* GET upload listing. */
    exports.index = function(req, res) {

      Forum.find({},function(err, queries) {
       res.send(queries);
   });

  };

  exports.postForum = function(req, res) {
    var bdy = req.body;
    var d = new Date();
    var n = d.getTime();

    var followersArr = [bdy.userid];
    var followersGCMArr = [];
    var b;
    var k = {
        user: bdy.userid,
        time: n,
        text: bdy.post_text,
        coursecode: bdy.coursecode,
        type: bdy.post_type,
        queid: bdy.queid,
        followers: followersArr,
        followersGCM: followersGCMArr

    }
    User.findById(req.body.userid, function(err, existingUser) {
        if (existingUser) {
            k.username = existingUser.name;
            k.followersGCM.push(existingUser.gcmid);
        }
        console.log(k);
        var forum = new Forum(k);

        forum.save(function(err, question) {

            if (err) {
                return res.send({'status': false});
            }
            else{
                existingUser.questions.push(question.id);
                existingUser.save(function(err){
                    if(err){
                        res.send({'status': false});
                    }
                    else{
                        res.send({'status': true, 'message': question.id});           
                    }
                });
            }
        });
    });
}

exports.postanswerForum = function(req, res) {
        // var bdy = req.body;

        var d = new Date();
        var n = d.getTime();
        var id = new Date().getTime() + Math.random();
        console.log(req.query);
        var followersArr, index;
        
        User.findById(req.query.userid, function(err, existingUser) {
            if (existingUser) {
                console.log(existingUser);
                var b = existingUser.name;

                Forum.findById(req.query.question_id, function(err, question) {
                    if (question) {
                        if(!question.answers){
                           question.answers = [];
                       }
                       question.answers.push({
                        "_id": id.toString(),
                        "time": n,
                        "text": req.query.text,
                        "user":req.query.userid,
                        "username": b,
                        "votes": 0
                    })
                   }
                   question.markModified('answers');
                   question.save(function(err) {

                    if (err) return res.send({
                        'status': false
                    });
                        else{
                            var followersArr = question.followersGCM;
                            index = followersArr.indexOf(existingUser.gcmid);				
                            delete followersArr[index];
                            var message = existingUser.name+' answered a question in '+question.coursecode;
                            gcmController.sendNotificationDis(followersArr, message, 'answer', question.time, question.username, question.text, question.id, existingUser.GCMID);
                            res.send({'status': true});
                        }
                    });
               });
}
});

}

exports.listForum = function(req, res) {

    Forum.find({
        coursecode: req.query.coursecode
    }, function(err, forums) {
        if (forums) {
                // console.log("enteredd");
                console.log(forums.length);
                res.send({'forumlist':forums.reverse()});
            }
        });    

}


exports.getAnswersList = function(req, res){

    var body = req.body;
    var userid = body.user_id;
    var discussionId = body.discussion_id;

    User.findById(userid, function(err, userr) {
      if (userr) {
        Forum.find({_id:discussionId}, {answers:1,_id:0}).sort({"answers.votes":-1, "answers.time":-1}).exec(function(err, answers){
            if(answers){
                answers.sort(function(a, b){
                 return a.votes-b.votes;
                })
                answers = answers.reverse();
                res.send({'status':true, 'answerslist':answers});
            }
            else{
                res.send({ 'status': false, 'message': 'cant get answers' });         
            }
        })
      }
      else{
        res.send({ 'status': false, 'message': 'cant find user' }); 
      } 
    }); 
}

exports.followDiscussion = function(req, res) {

  var body = req.body;
  var userid = body.user_id;
  var discussion_id = body.discussion_id;
  console.log(userid);
  console.log(discussion_id);

  User.findById(userid, function(err, userr) {
      if (userr) {

        userr.questions.push(discussion_id);
        userr.save(function(err){
            if(err){
                res.send({ 'status': false, 'message': 'cant update' }); 
            }
            else{
                Forum.update({_id:discussion_id}, {$addToSet: {followers:userid, followersGCM:userr.gcmid}}, function(err, forum){
                    if(forum){
                        res.send({ 'status': true, 'message': 'added successfully' }); 
                    }
                    else{
                        res.send({ 'status': false, 'message': 'cant update' }); 
                    }   
                })
            }
        })
    }
    else
    {
        res.send({ 'status': false, 'message': 'cant find user' }); 
    }
});
}

exports.unfollowDiscussion = function(req, res) {

  var body = req.body;
  var userid = body.user_id;
  var discussion_id = body.discussion_id;
  var gcmid = body.gcm_id;

  User.update({_id:userid}, {$pull:{questions:discussion_id}}, function(err, user){

    if(err){
        res.send({ 'status': false, 'message': 'cant find user' }); 
    }
    else{
        Forum.update({_id:discussion_id}, {$pull: {followers:userid}}, function(err, forum){
            if(forum){  
                Forum.update({_id:discussion_id}, {$pull: {followersGCM:gcmid}}, function(err, forums){
                    if(forums){
                        res.send({ 'status': true, 'message': 'removed successfully' }); 
                    }
                    else{
                        res.send({ 'status': false, 'message': 'failed to remove successfully' }); 
                    }
                })
            }
            else{
                res.send({ 'status': false, 'message': 'cant update' }); 
            }   
            });    
        }
    });
}

exports.deleteDiscussion = function(req, res){
    var body = req.body;
    var userid = body.user_id;
    var discussionId = body.discussion_id;

    Forum.remove({user:userid, _id:discussionId}, function(err, result){
        if(result){
            res.send({ 'status': true, 'message': 'Discussion removed successfully.' }); 
        }
        else{
            res.send({ 'status': true, 'message': 'Failed to remove discussion.' });    
        }
    });
}

exports.upvoteAnswer = function(req, res){
    var body = req.body;
    var userid = body.user_id;
    var answerId = body.answer_id;
    var discussionId = body.discussion_id;

    User.findById(userid, function(err, userr) {
      if (userr) {

        userr.answers.push(answerId);
        userr.save(function(err){
            if(err){
                res.send({ 'status': false, 'message': 'cant update' }); 
            }
            else{
                Forum.update({_id:discussionId, "answers._id":answerId}, {$inc:{"answers.$.votes":1}}, function(err, forum){
                    if(forum){
                        res.send({ 'status': true, 'message': 'upvoted successfully' }); 
                    }
                    else{
                        res.send({ 'status': false, 'message': 'failed to upvote' }); 
                    }
                });
            }
        })
    }
  });
}