var Prod= require('../models/product');
var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/pindB', function(err,db){
    if (!err){
        console.log('Connected to /pindB!');
    } else{
        console.dir(err); //failed to connect
    }
});

var Products= [new Prod({
	imgurl: './public/images/shahipaneer.jpg',
	title: 'Shahi Paneer',
	type: 'Veg Main Course',
	price: 220
}),
new Prod({
	imgurl: './public/images/chickenmughlai.jpg',
	title: 'Chicken Mughlai',
	type: 'Non-veg Main Course',
	price: 380
}),
new Prod({
	imgurl: './public/images/chickentikka.jpg',
	title: 'Chicken Tikka',
	type: 'Non-veg Snacks',
	price: 260
}),
new Prod({
	imgurl: './public/images/paneertikka.jpg',
	title: 'Paneer Tikka',
	type: 'Veg Snacks',
	price: 200
}),
new Prod({
	imgurl: './public/images/afghanichicken.jpg',
	title: 'Afghani Chicken',
	type: 'Non-veg Snacks',
	price: 280
}),
new Prod({
	imgurl: './public/images/tandoriroti.jpg',
	title: 'Tandori Roti',
	type: 'Breads',
	price: 8
}),
new Prod({
	imgurl: './public/images/gulabjamun.jpg',
	title: 'Gulab Jamun',
	type: 'Dessert',
	price: 20
}),
new Prod({
	imgurl: './public/images/pappad.jpg',
	title: 'Pappad',
	type: 'Veg Snacks',
	price: 5
})];
var done=0;
for(var i=0;i<Products.length;i++)
{
	console.log(Products[i]);
	Products[i].save(function(err,result){
		console.log(result);
		done++;
		if(done=== Products.length)
			exit();
	});
}
function exit(){
	mongoose.disconnect();
}