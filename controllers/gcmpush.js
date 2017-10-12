var secrets = require('../config/secrets');
var GCM = require("yodel-gcm");
var gcm = new GCM(secrets.GCM_API_KEY);

var Course = require('../models/Course');
var User = require('../models/User');

exports.sendNotification = function(deviceIds, message, coursecode, type){
    console.log(deviceIds);
    var message = {
        'registration_ids': deviceIds, // required
        'data.message': message,
        'data.type': type,
        'data.coursecode': coursecode
    };

    gcm.send(message, function(err, messageId){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Sent with message ID: ", messageId);
        }
    });
}