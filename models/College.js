var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collegeSchema = new mongoose.Schema({
    city: String,
    college: String,
});

module.exports = mongoose.model('College', collegeSchema);