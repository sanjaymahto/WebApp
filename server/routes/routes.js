var userModel = require('../models/users')
var createUser = require('../auth/createUser');
var checkLogin = require('../auth/checkLogin').checkLogin;//(checkLogin, userPresent, loginStatus )
var loginVars = require('../auth/checkLogin').loginVars;
var path = require('path');
var uuid = require ('node-uuid');
var updatePrices = require('../updatePrices/updatePrices');
var forgotPassword = require('../auth/forgotPassword');
var changePassword = require('../auth/changePassword');
var  verifyEmail = require('../auth/verifyEmail');
var saveData = require('../saveProject/saveProject')
var getSavedData = require('../saveProject/getSavedProject')


var publicFiles = path.join(__dirname + '/../../app/www');
module.exports = function(app){
  app.get('/', function(req, res){
  	res.sendFile(publicFiles + '/login.html')
  })

  app.post('/login',function(req, res){
  	var email = req.body.email;
  	var password = req.body.password;
    var loginStatus = checkLogin(email, password, req, res);
  })

  app.post('/register', function(req, res){
  	var email = req.body.email;
  	var password= req.body.password;
  	var telephone = req.body.telephone;
    var newUser = createUser(email, password, telephone, req, res);
  })

  //ROUTE NOT USED
  // app.get('/updatePrices', function(req, res){
  //   res.sendFile(publicFiles + '/updatePrices.html')
  // })

  app.post('/updatePrices', function(req, res){
    updatePrices.updatePrices(req, res);
  })

  app.get('/updatePrices/data', function(req, res){
    updatePrices.sendData(req, res);
  })

  //NOT USED
  // app.get('/updatePrices/sync', function(req, res){
  //   updatePrices.syncData(req, res)
  // })

  app.post('/savedata', function(req, res){
    saveData(req, res)
  })

  app.post('/getsavedata', function(req, res){
    getSavedData(req, res)
  })

  //FORGOT password
  app.post('/forgot-password', function(req, res){
    console.log(req.body.email);
    var emailId = req.body.email;
    var id = uuid.v4();
    console.log( "id:"+id)
   forgotPassword(req, res, emailId, id);
  })

  app.get('/user/reset/:id', function(req, res){
    uniqueId = req.params.id;
    res.sendFile(publicFiles + '/forgotform.html')
  })

  app.post('/change-password', function(req, res){
    changePassword(req, res)
  })

  app.get('/verify/:id',function(req,res){
    var queryParam = req.params.id;
    verifyEmail(req, res, queryParam);
  })

  //handle 404's - better to handle 404's this way rather than try/caatch - http://stackoverflow.com/questions/38202891/express-js-global-try-catch
  //always keep this at the last
  app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      res.send('404');
      //res.sendFile(publicFiles + '/404.html') //When Anirban adds a custom 404 page
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  });



}
