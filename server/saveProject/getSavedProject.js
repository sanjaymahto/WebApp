var userModel = require('../models/users');

module.exports = function(req, res){
  var Email = req.body.email;
  console.log(Email)

    if(!Email){
    res.json({'projectList' : 'false', 'error' : 'User not logged in or Email not entered'})
    return false;
  }
  var query = {'email':Email.toLowerCase()}

  userModel.findOne(query).exec(function(err, user){
    if(err){console.log(err); res.json({'projectList' : 'false' , 'error' : 'Database error'}); return false;}

    if(user){
      if(!user.projectData){
        res.json({'projectList' : ''}); return false;
      }else{
        var projects = [];
        for(var i = 0; i < user.projectData.length; i++){
          //console.log('ProjectList : ' + user.projectData[i].projectName)
          if(user.projectData[i])
           projects[i] =   user.projectData[i];

        }
        res.json({'projectList' : projects})
      }
  }
  else{
    res.json({'projectList' : 'false', 'error' : 'userNotFound'})
    console.log({'projectList' : 'false', 'error' : 'userNotFound'})
  }
  })



}
