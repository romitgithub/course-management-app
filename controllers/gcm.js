var secrets = require('../config/secrets');
var GCM = require('gcm').GCM;


var gcm = new GCM(secrets.GCM_API_KEY);

exports.sendNotification=function(deviceId, messageNotif, type, coursecode, coursetitle){

	for (var i = 0; i<deviceId.length;i++) {
		var message = {
		    registration_id: deviceId[i], // required
		    collapse_key: 'Collapse key', 
		    'data.message': messageNotif,
		    'data.type': type,
		    'data.coursecode': coursecode,
		    'data.coursetitle': coursetitle,
		};

		console.log(message);

		gcm.send(message, function(err, messageId){
		    if (err) {
		        console.log(err);
		    } else {
		        console.log("Sent with message ID: ", messageId);
		    }
		});	
	}
}

exports.sendNotificationDis=function(deviceId, messageNotif, type, date, uploader, question, discussionId, userGCMID){

	for (var i = 0; i<deviceId.length;i++) {
		if(deviceId===userGCMID){continue;}
		var message = {
		    registration_id: deviceId[i], // required
		    collapse_key: 'Collapse key', 
		    'data.message': messageNotif,
		    'data.type': type,
		    'data.date': date,
		    'data.uploader': uploader,
		    'data.question': question,
		    'data.discussion_id':discussionId
		};

		console.log(message);

		gcm.send(message, function(err, messageId){
		    if (err) {
		        console.log(err);
		    } else {
		        console.log("Sent with message ID: ", messageId);
		    }
		});	
	}
}
