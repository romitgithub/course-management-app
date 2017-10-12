/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var GCM = require("gcm").GCM;
// var lusca = require('lusca');
var methodOverride = require('method-override');
var multer = require('multer');
// var upload = multer({ dest: 'public/uploads/'});

var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var uploadController = require('./controllers/upload');
var forumController = require('./controllers/forum');
var courseController = require('./controllers/course');
var anouncController = require('./controllers/anounc');
var reportController = require('./controllers/report');
var timetableController = require('./controllers/timetable');


/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();
var College = require('./models/College');

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compress());
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000
}));

app.use(connectAssets({
    paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')]
}));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
// app.use(multer({
//     dest: path.join(__dirname, 'uploads')
// }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secrets.sessionSecret,
    store: new MongoStore({
        url: secrets.db,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});




var uploading = multer({
  dest: __dirname + '/public/uploads/',
})


/**
 * Primary app routes.
 */

app.get('/', function(req, res) {
College.findOne({}, function(err, college){
        console.log(college);
        console.log(err);
});
console.log('Request received: ' + req.url);
  res.send('Hello World!');
});


// app.get('/login', userController.getLogin);
app.get('/country',userController.country);
app.get('/capital',userController.capital);
app.post('/login', userController.postLogin);
// app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/logout', passportConf.isAuthenticated, userController.logout);
app.get('/upload', passportConf.isAuthenticated, uploadController.index);
app.post('/upload', uploading, uploadController.postUpload);
app.post('/upload_', uploading, uploadController.multiFileUploads);
app.post('/upload__', uploading, uploadController.update_Upload);
// app.post('/upload', passportConf.isAuthenticated, uploading, uploadController.postUpload);
app.get('/search', passportConf.isAuthenticated, uploadController.getSearch);
app.post('/search_', uploadController.getSearch_);
app.get('/forum', passportConf.isAuthenticated, forumController.index);
app.post('/forum', forumController.postForum);
app.get('/forum/answer', forumController.postanswerForum);
app.post('/forum/list', forumController.listForum);
app.post('/forum/answerslist', forumController.getAnswersList);
app.post('/user/add', userController.addCourse);
app.post('/user/removeCourse', userController.removeCourse);
app.post('/user/updategcmid', userController.updateGCMId);
app.post('/update', uploading, uploadController.updateUser);
app.post('/allcourses1', userController.allcourses1);
app.get('/insert', courseController.index);
app.post('/insert', courseController.postinsert);
app.post('/addnewcourse', courseController.addNewCourse);
app.post('/announcement', anouncController.postannouncement);
app.get('/announcement', anouncController.getannouncement);
app.get('/gcm', userController.gcm);
app.get('/authenticate', userController.authenticate);
app.get('/course/verify', courseController.verifyCourse);
app.get('/send', courseController.send);
app.post('/upload/getfile', uploadController.getFileModel);
app.post('/discussion/follow', forumController.followDiscussion);
app.post('/discussion/unfollow', forumController.unfollowDiscussion);
app.post('/discussion/delete', forumController.deleteDiscussion);
app.post('/uploads/delete', uploadController.deleteUpload);
app.post('/announcement/delete', anouncController.deleteAnnouncement);
app.post('/answer/upvote', forumController.upvoteAnswer);
app.post('/report',reportController.postReport);
app.post('answer/upvote', forumController.upvoteAnswer);
app.post('/courses/coursecodes', courseController.getAllCourseCodes);
app.post('/search/courses', courseController.searchCourses);
app.post('/addcollege', userController.addCollege);
app.post('/timetable/scheduler', timetableController.runScheduler);
app.post('/timetable/schedulercheck', timetableController.runSchedulercheck);
app.get('/timetable/inputtime', timetableController.getInputTime);
app.post('/timetable/inputtime', timetableController.postInputTime);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
