const express = require('express')
const router = express.Router()
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const OrderDetails = require ('../models/orderDetailsModel')




router.post("/createcheckout",async (req,res)=>{

   try { 
    const { products , total , shippingDetails , userId } = req.body
    console.log( products , total , shippingDetails , userId)
    const lineItems = products.map((products)=>({
    price_data:{
        currency:"inr",
        product_data:{
            name:products.productName,
            images:[products.productThumbnail],
        },
        unit_amount: products.productPrice*100 + 1000
    },
    quantity:1
    }))
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:lineItems,
        mode:"payment",
        success_url : "https://newkartfrontend.vercel.app",
        cancel_url:"https://newkartfrontend.vercel.app"
    })





    for (let product of products) {
    const newOrderDetail = new OrderDetails({
        userId,
        products: [{
            productId: product.productId ,
            quantity: product.quantity || 1,
            productName: product.productName,
            productThumbnail: product.productThumbnail,
            sellerId: product.sellerId,
            productPrice: product.productPrice + 1000,
            category: product.category


        }],

        totalPrice : total,
        shippingDetails: shippingDetails,
        orderStatus: 'Pending',
        paymentStatus: 'Pending',
        paymentId: session.id,

    })





    await newOrderDetail.save()
    console.log('orderdetails saved successfully' , product.productName)
    }



    res.json({id:session.id})


   }catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });

   }





})


router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature']; // Get Stripe signature header
    let event;
  console.log('request recieved')
    try {
      // Verify the webhook signature and construct the event
      event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_NWblcxfJNMvqdpCjQigqGI1zqyKdoagP');
    } catch (err) {
      // If the signature verification fails, return an error
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object; // This contains the Stripe session details
  
      try {
        // Find the order in your database using the session ID
        const order = await OrderDetails.findOne({ paymentId: session.id });
  
        if (order) {
          // Update the order's payment and order status
          order.paymentStatus = 'Completed';

          await order.save();
          console.log(`Order ${order._id} payment status updated to 'Paid'`);
        }
  
        // Send a response back to Stripe
        res.status(200).json({ received: true });
      } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Server Error' });
      }
    } else {
      // Return a 200 response for events that aren't handled
      res.status(200).json({ received: true });
    }
  });


exports.router = router;
