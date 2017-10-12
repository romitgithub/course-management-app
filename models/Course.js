var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new mongoose.Schema({
    coursecode: String,
    coursetitle: String,
    professor: String,
    collegeid:String,
    followers: Schema.Types.Mixed,
    followersGCM: Schema.Types.Mixed,
    timetable: Schema.Types.Mixed,
    verified:Boolean

});


module.exports = mongoose.model('Course', courseSchema);
