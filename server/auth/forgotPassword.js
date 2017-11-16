var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport;
var userModel = require('../models/users');
//var config = require('../../../config');

var config = require('./../config');


function sendEmail(res, emailId, user, id){
  let transporter = nodemailer.createTransport({
      service: 'Zoho',
      auth: {
          user: config.zohoEmail,
          pass: config.zohoPassword
      }
  });


  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Saint Gobain" <test@1byzerolabs.co.in>', // sender address
      to: emailId, // list of receivers
      subject: 'Reset your SaintGobain Shower App Password', // Subject line
      html: '<h1> Hello '  + user.email  + '</h1>' +   "<p> Here is the link to reset your password </p>" + "<a href=http://ec2-34-205-38-121.compute-1.amazonaws.com:3000"+ id + '>Reset</a>',
      //Request DSN for undelivered and delayed messages
      dsn: {
        id: 'Delivery of forgot password mail to the following user failed or is delayed',
        return: 'headers',
        notify: 'success',
        recipient: config.zohoEmail
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
       res.json({'emailSent' : 'true', 'emailExists' : 'true'})
  });
}

module.exports = function(req, res, emailId, id){
  var emailID = emailId.toLowerCase();
  var query = {'email':emailId};

  userModel.findOne(query, function(err, user) {

       if (!user) {
         console.log('error', 'No account with that email address exists.');
         res.json({'emailSent' : 'false', 'emailExists' : 'false'})
       }else{

         userModel.collection.update(user, { $set: { user_id : id }}, {upsert:true}, sendEmail(res, emailId, user, id))


    }//end of else

});
}
