var userModel = require('../models/users');
var bcrypt = require('bcrypt-nodejs');

//module.exports=
function checkLogin(emailID, password, req, res){
  console.log(emailID, password)
  if(!emailID){
    res.json({loginStatus : false, error : 'Please enter a valid emailID'});
    return false
  }

  if(!password){
    res.json({loginStatus : false, error : 'Please enter a valid password'})
    return false
  }

  if(!req){
    res.send('Unknown error : request obj not found')
    return false
  }

  if(!res){
    res.send('Unknown error : response obj not found')
    return false
  }

emailID = emailID.toLowerCase();
// var Emailname = emailID.substring(0, emailID.indexOf("@"));//Extract name from Email id Ex:admin is stored in Emailname for a emailID of admin@gmail.com
// var emailIdNoDots = Emailname.replace(/\./g,'')
// var emailDomain = emailID.replace(/.*@/, "");//extract the domain name from emailID
//
// var finalEmailID = emailIdNoDots + '@' + emailDomain;

  var query = userModel.findOne({email : emailID}, function findUser(err, user){
    if(err) {console.log(err)}
    if(!user){
      console.log('User not present in database. Please register');
      res.json({userPresent : false, loginStatus : false, isAdmin : false})
    }
    else{
      if(user.email === emailID) {
          if(bcrypt.compareSync(password, user.password)){
            if(user.isAdmin){
              console.log('Admin Login Success');
              res.json({userPresent : true, loginStatus : true, isAdmin : true})
            }else{
              console.log('Login SUCCESS');
              res.json({userPresent : true, loginStatus : true, isAdmin : false})
            }

          }
          else{
            console.log('Please enter the right password');
            res.json({userPresent : true, loginStatus : false})
          }
        }
      }
    })
}


module.exports = { checkLogin : checkLogin  }
