var userModel = require('../models/users');
var bcrypt = require('bcrypt-nodejs')
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport;
var uuid = require ('node-uuid');
//var config = require('../../../config');
var config = require('./../config.js');

function createUser(email, password, telephone, req, res){

  if(!email){
    res.json({'error': 'Please enter a valid Email id'})
    res.end(); return false
  }

  if(!password){
    res.json({'error' : 'Please enter a valid password'})
    res.end(); return false
  }

  if(!telephone){
    res.json({'error' : 'Please enter a valid telephone number'})
    res.end(); return false
  }

  if(!req){
    res.json({'error' : 'Unknown Error : Request object not found'});
    res.end(); return false
  }

  if(!res){
    res.json({'error' : 'Unknown error : Response object not found'})
    res.end(); return false
  }

  //Email parser
  emailID = email.toLowerCase();
  // var Emailname = emailID.substring(0, emailID.indexOf("@"));//Extract name from Email id Ex:admin is stored in Emailname for a emailID of admin@gmail.com
  // var emailIdNoDots = Emailname.replace(/\./g,'')
  // var emailDomain = emailID.replace(/.*@/, "");//extract the domain name from emailID
  // var finalEmailID = emailIdNoDots + '@' + emailDomain;

//  createAdmin(); //uncomment this to create a admin account
    // var usernameObj      = {username:username};
    var emailObject = {email : emailID};
    var telObject = {telephone : telephone};
    var passwordHash = bcrypt.hashSync(password);
    var userObject = {email: emailID, password: passwordHash , telephone: telephone, isAdmin : false, emailVerified : false};

    var jsonObj = {}

    //make sure this username does not exist already
    userModel.count(emailObject, function(err, count){
      if(err){
       res.json({ 'error': err });
        next()
        return false;
      }
      if(count > 0){
        error = 'The Email-ID you entered already exists - '+ userObject.email;
        console.log(error)
        res.json({"email" : email, "emailExists" :true, "registerDone" : false})
      }else{
        checkTel();
      }


      })


      function checkTel(){
        userModel.count(telObject, function(err, count){
          if(err){
           res.json({ 'error': err });
            next()
            return false;
          }
          if(count > 0){
            error = 'The telephone number you entered already exists - '+ userObject.telephone;
            console.log(error);
            res.json({ "emailExists" : false, "telephone" : telephone, "telephoneExists" : true, "registerDone" : false})
          }else{
            sendVerificationEmail(emailID, res, userObject);
            saveUser();
          }
          })
      }

}

function saveUser(res, userObject, randomId){

    // create the new user to save
    userObject.verifyId = randomId;
    var saveModel = userModel(userObject)
    saveModel.save(function(err,user){
        console.log('its here')
      if(err){
        console.log(err);
        res.json({ error: 'Saving user failed! Database Error' });
        return false;
      }else{
      console.log('unique user to be registered', user);
      res.json({ "emailExists" : false , "telExists" : false, "registerDone" : true, "verifyEmailSent" : true})

      }
    })//userModel.save done
}

function sendVerificationEmail(emailID, res, userObject){
  let transporter = nodemailer.createTransport({
      service: 'Zoho',
      auth: {
          user: config.zohoEmail,
          pass: config.zohoPassword
      }
  });

  var randomId = uuid.v4();
  var verifyLink = "<a href=http://ec2-34-205-38-121.compute-1.amazonaws.com:3000/verify/"+ randomId + '>Click Here To verify Your Email ID</a>'

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Saint Gobain" <test@1byzerolabs.co.in>', // sender address
      to: emailID, // list of receivers
      subject: 'Verify Your Email ID for Saint Gobain Shower Cubicles App', // Subject line
      html: '<h1> Hello '  + emailID  + '</h1>' +   "<p> Here is the link to verify your Email ID for Saint Gobain Shower Cublicles App </p>" + verifyLink,
      //Request DSN for undelivered and delayed messages
      dsn: {
        id: 'Delivery of Email verification mail to the following user failed or is delayed',
        return: 'headers',
        notify: 'success',
        recipient: config.zohoEmail
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          res.json({ "emailExists" : false , "telExists" : false, "registerDone" : true, "verifyEmailSent" : false, "error" : "Error Sending Email.Please Try Again"})
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
      saveUser(res, userObject, randomId);
  });

}

// function createAdmin (){
//     // create the new user to save
//     var saveModel = userModel({username: 'ADMIN', password: bcrypt.hashSync('password') ,email : 'admin@1byzerolabs.co.in', telephone: '9876543210', isAdmin : true})
//     saveModel.save(function(err,user){
//       if(err){
//         console.log(err)
//       }else{
//       console.log('Admin Account created with following credentials \n', user);
//     //  res.json({"userNameExists" : false,  "emailExists" : false , "telExists" : false, "registerDone" : true})
//
//       }
//     })//userModel.save done
// }


module.exports = createUser;
