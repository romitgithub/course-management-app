var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new mongoose.Schema({
    coursecode: String,
    category: String,
    description: String,
    uploadedby: String,
    uploader: String,
    time: String,
    files: Schema.Types.Mixed
});


module.exports = mongoose.model('File', fileSchema);
