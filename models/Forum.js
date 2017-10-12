var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var forumSchema = new mongoose.Schema({
    user: String,
    username: String,
    text: String,
    time: Number,
    coursecode: String,
    type: Number,
    answers: Schema.Types.Mixed,
    queid: String,
    followers: Schema.Types.Mixed,
    followersGCM: Schema.Types.Mixed,
});



module.exports = mongoose.model('Forum', forumSchema);
