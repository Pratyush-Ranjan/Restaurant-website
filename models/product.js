var mongoose= require ('mongoose');
var productSchema=mongoose.Schema({
    imgurl:{ type:String, required:true },
    title:{ type:String, required:true },
    type:{ type:String, required:true },
    price:{ type:Number, required:true }
});

module.exports= mongoose.model('product',productSchema);

