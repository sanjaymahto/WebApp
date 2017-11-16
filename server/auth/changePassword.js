var userModel = require('../models/users');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(req, res, id){
  console.log(id)
  var uniqueId = req.body.id; //recieve id from the front end which is basically the parameter part of the URL. TO be done
  var newPassword = req.body.password;
    var query = {'user_id' : uniqueId};
    userModel.findOneAndUpdate(query, {'password' : bcrypt.hashSync(newPassword)}, {upsert:true}, function(err, doc){
    if (err){console.log(err); res.json({'passwordChanged' : 'false','error' : 'true'})}
    else {res.json({'passwordChanged' : 'true','error' : 'false'});  console.log('Password Changed Successfully') ;}
    console.log(doc)
});

  }
