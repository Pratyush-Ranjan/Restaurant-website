var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/pass')(passport);
var Product= require('../models/product');
var User= require('../models/user');
var Cart= require('../models/cart');
var Order= require('../models/order');
var Tables=require('../models/tables');
//paypal
var paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AR8rX29PrbNvjB95KUWBxnvOhxpWakfw2QqU88OVMcgFKrvH6bF9fJVv8itXfJXoSPj64mB7O3lxwmd1',
  'client_secret': 'EJqj9bS6g9dMhRU2wJKiWdHHphg3HpRJV2oIuhL05sViNjSOvV6Z8mTxRvfzXIrmD86qTqf2pe7E5s-1'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pind-Balluchi' });
});


router.get('/api/tables', function(req, res, next) {
  Tables.countDocuments(function(err,docs){
    if (err)
    res.send(err);
  else
    res.json(docs);
  });
});

router.post('/api/reservetable', function(req,res,next) {
Tables.create({
    codename: req.body.codename,
    name: req.body.name,
    phone: req.body.contact
  },function(err,docs){
    if (err)
    res.send(err);
  else
  res.json(docs);
  }); 
});

router.post('/api/canceltable/:cname', function(req,res,next) {
Tables.deleteOne({
    codename: req.params.cname,
  },function(err,docs){
    if (err)
    res.send(err);
  else
  res.json(docs);
  }); 
});

router.get('/api/products', function(req, res, next) {
  Product.find(function(err,docs){
  	if (err)
		res.send(err);
	else
		res.json(docs);
	});
});

router.get('/api/orders', function(req, res, next) {
  Order.find(function(err,docs){
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

router.post('/api/checkout/:name',(req,res)=> {
	let cart= new Cart(req.session.cart ? req.session.cart : {} );
	req.session.cart= cart;
var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/#/success",
        "cancel_url": "http://localhost:3000/#/checkout"
    },
    "transactions": [{
        "amount": {
            "currency": "INR",
            "total": cart.totalPrice
        },
        "description": "This is the payment description."
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
    	var newOrder= new Order({
                username:req.params.name,
                order:cart,
                name:req.body.name,
                address:req.body.address,
                phone:req.body.contact    
            })
            newOrder.save();
    	User.findOne({username:req.params.name}).then((user)=> {
               
              user.orders.push(user.cart);
              req.session.cart= null;
              user.cart= null;
               
              user.save().then(()=> {
                  console.log(user);
              })
           });
        console.log("Create Payment Response");
         for(let i=0; i< payment.links.length; i++){
            if(payment.links[i].rel==='approval_url'){
                res.send(payment.links[i].href);
            }
        }
    }
});
});

/*router.post('/api/checkout/:name',(req,res)=> {
    
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
                username:req.params.name,
                order:req.session.cart,
                name:req.body.name,
                address:req.body.address,
                paymentId:charge.id,     
            })
            newOrder.save();
            
        
           User.findOne({username:req.params.name}).then((user)=> {
               
              user.orders.push(user.cart);
              console.log(user.orders[0]);
              req.session.cart= null;
              user.cart= null;
               
              user.save().then(()=> {
                  res.json(user);
              })
           })
        }
    });
    
});*/

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
