var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reportSchema = new mongoose.Schema({
    objectid: String,
    type:String,
    userid: String,
    Time: Number
});


module.exports = mongoose.model('Report', reportSchema);
