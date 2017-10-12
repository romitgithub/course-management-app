var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collegeRequestSchema = new mongoose.Schema({
    city: String,
    college: String,
    email:String
});

module.exports = mongoose.model('CollegeRequest', collegeRequestSchema);
