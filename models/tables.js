const mongoose= require ('mongoose');
const orderSchema= mongoose.Schema({
    codename:{
        type:String,
        required:true
    },
    name:{ 
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    }
});

module.exports= mongoose.model('tables',orderSchema);
