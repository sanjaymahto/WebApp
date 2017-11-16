var userModel = require('../models/users');


module.exports = function(req, res, queryParam){
    var query = {verifyId : queryParam};
    console.log(query)
//     userModel.findOneAndUpdate(query, {emailVerified :true}, function(err, doc){
//     if (err){console.log(err); res.json({'emailVerified' : 'false','error' : 'Mongo Error'})}
//     else {res.json({'emailVerified' : 'true','error' : 'false'});
//     console.log('Email Verified Successfully' + doc ) ;}
// });

userModel.findOne(query, function (err, user) {
  if(err) {res.json({'emailVerified' : 'false','error' : 'Mongo Error in Finding Verification ID'}); return error;}
  console.log(user)
  if(user){
    user.emailVerified = true;
    user.save(function (err) {
        if(err) {
            console.error(err);
            res.json({'emailVerified' : 'false','error' : 'Mongo Error in Saving'});
            return error;
        }

        console.log('Email verified for the user ' + user.email)
        res.json({'emailVerified' : 'true','error' : 'false'});
        user.verifyId = ''
        user.save(function(err){
          console.log('Email verified and verifyId removed')
        })
    });
  }
  else{
    console.log('User with Email query ID not found. Please Check Database')
    res.json({'emailVerified' : 'false','error' : 'User Not Found'});
  }


});

  }
