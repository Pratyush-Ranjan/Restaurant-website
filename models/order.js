const mongoose= require ('mongoose');
const orderSchema= mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    order:{
        type:Object,
        required:true,
    },
    name:{ 
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    }
});

module.exports= mongoose.model('order',orderSchema);
