var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt   = require('bcrypt-nodejs');
    SALT_WORK_FACTOR = 10;

var projectDataSchema = new Schema({
  projectName : {type : String, required : true },
  glassType : {type : String, required : true},
  glassNature : {type : String, required : true } ,
  glassSubClass : { type: String, required : true } ,
  width : { type : String },
  height : {type: String }
})

var UserSchema = new Schema({
		email :{ type: String, required:true, set: toLower},
    password: { type: String, required: true },
    telephone : {type: Number, required: true, unique : true},
    isAdmin : {type : Boolean},
    user_id: { type: String },
    emailVerified : {type: Boolean, required : true, default : false},
    verifyId : {type: String},
    projectData : [projectDataSchema]
});

function toLower (str) {
  return str.toLowerCase();
}


module.exports = mongoose.model('User', UserSchema);
