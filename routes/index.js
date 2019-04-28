var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/pass')(passport);
var Product= require('../models/product');
var User= require('../models/user');
var Cart= require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pind-Balluchi' });
});

router.get('/api/products', function(req, res, next) {
  Product.find(function(err,docs){
  	if (err)
		res.send(err);
	else
		res.json(docs);
	});
});

router.get('/checkoutcart', (req,res)=>{
    if(!req.session.cart)
    	res.send('0');
    else
    	res.send('1');
});

router.post('/api/additem/:name', function(req, res, next) {
let cart= new Cart(req.session.cart ? req.session.cart : {} );
    
    Product.findById(req.body.itemid).then((product)=> {
    
        cart.add(product, product.id);
        cart.generateArray();
        req.session.cart= cart;
   
           User.findOne({username:req.params.name}).then((user)=> {
           user.cart=req.session.cart;
             user.save().then(()=>{
             	console.log(user.cart);
                  res.json(user); 
             })
        });
        });   
});

router.get('/cart/:name',(req,res)=> {
        User.findOne({username:req.params.name},function(err,docs){
  	if (err)
		res.send(err);
	else
		res.json(docs);
	});
});

router.post('/api/removeItem/:name/:id',(req,res)=> {
    let cart= new Cart(req.session.cart ? req.session.cart : {} );
    cart.removeItem(req.params.id);
    cart.generateArray();
    req.session.cart= cart;
    
    if(req.isAuthenticated()){ 
        User.findOne({username:req.params.name}).then((user)=> {
            user.cart= cart;  
            user.save();
            res.json(user);
        })
    }  
})

router.post('/api/reduceItem/:name/:id',(req,res)=> {
    let cart= new Cart(req.session.cart ? req.session.cart : {} );
    cart.reduceByOne(req.params.id);
    cart.generateArray();
    req.session.cart= cart;
    
    if(req.isAuthenticated()){ 
        User.findOne({username:req.params.name}).then((user)=> {
            user.cart= cart;  
            user.save();
            res.json(user);
        })
    }  
})

router.post('/api/checkout',(req,res)=> {
    
    var stripe = require("stripe")("sk_test_JFyJNPEu7Ld6DOjnMxZU5CTY");

    stripe.charges.create({
      amount: req.session.cart.totalPrice * 100,
      currency: "usd",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Charge for products."
    }, function(err, charge) {
      if(err){
          console.log(err);
          req.flash('error_message',err.message);
          return res.redirect('/checkout');
      }
        if(charge){
            
            console.log(charge);
            const newOrder= new Order({
                userEmail:req.user.email,
                order:req.user.cart,
                name:req.body.name,
                address:req.body.address,
                paymentId:charge.id,     
            })
            newOrder.save();
            
        
           User.findOne({email:req.user.email}).then((user)=> {
               
//              user.orders.push(user.cart);
//              console.log(user.orders[0]);
              req.session.cart= null;
              user.cart= null;
               
              user.save().then(()=> {
                  req.flash('success_message',`successfully bought product(s)!`);
                  res.redirect('/');
              })
           })
        }
    });
    
});

//login
router.post('/login', function(req, res, next){
console.log('calling passport)');
  passport.authenticate('local-login', function(err, user){
    if(err){ return next(err); }
req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json(user);
       });
  })(req, res, next);
});

    // handle logout
    router.post("/logout", function(req, res) {
      req.logOut();
      res.send(200);
    })

    // loggedin
    router.get("/loggedin", function(req, res) {
      res.send(req.isAuthenticated() ? req.user : '0');
    });

router.post("/register", function(req, res, next) {
          var user = new User();
          user.username = req.body.rusername;
          user.password = user.generateHash(req.body.rpassword);
          user.save(function(err, user) {
            req.logIn(user, function(err) {
              if (err) { return next(err); }
              res.json(user);
            });
          });
  });
module.exports = router;
