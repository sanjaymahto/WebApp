var http = require('http');
var path = require('path')
var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var userModel = require('./models/users');
// var expressValidator = require('express-validator');
//var config = require('../../config.js')
var config = require('./config.js')
var app = express();

//dont minify source
app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/../app/www');

//middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator())
app.use(logger('dev'));
// Enable CORS from client-side
var allowCrossDomain = function(req, res, next) {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
// intercept OPTIONS method
if ('OPTIONS' == req.method) {
res.sendStatus(200);
} else {
next();
}
};

app.use(allowCrossDomain);

//let users access this folder
var publicFiles = path.join(__dirname + '/../app/www');
app.use(express.static(publicFiles));


var dbURL = config.db.url;

// if (app.get('env') == 'live'){
// // prepend url with authentication credentials //
// 	dbURL = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+dbHost+':'+dbPort+'/'+dbName;
// }

// configuration ===============================================================
mongoose.connect(dbURL); // connect to our database

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connection established @ ' + dbURL);
});

console.log("database "+dbURL);
// Routes
require('./routes/routes.js')(app);

console.log("database1 "+dbURL);
http.createServer(app).listen(3000, function(){
	console.log('Express server listening on port ' + 3000);
});
