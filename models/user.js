var mongoose= require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema= mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required: true },
	 cart:{
        type: Object,
        default:null
    },
    orders:[{
        type: Object,
       default:null
   }]
},{usePushEach: true});
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);