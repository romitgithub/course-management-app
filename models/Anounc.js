var mongoose = require('mongoose');


var anouncSchema = new mongoose.Schema({
    coursecode: String,
    announcement: String,
    user: String,
    username: String,
    time: Number
});


module.exports = mongoose.model('Anounc', anouncSchema);