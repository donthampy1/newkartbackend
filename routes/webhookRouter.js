const express = require('express')
const router = express.Router()
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const OrderDetails = require ('../models/orderDetailsModel')
const  model = require ('../models/usermodel.js')
const User = model.User
const CartData = require('../models/cartModel') 



router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify the event by constructing it with the raw body
        event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_j4FZgzz2xFKPdGkGer3XKAt3NSwQT7eT');
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event (e.g., payment_intent.succeeded, payment_intent.failed)
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent was successful!`, paymentIntent);
            // Perform additional logic here
            break;
        // Handle other event types as needed
        default:
            console.log(`Unhandled event type ${event.type}`);
    }






    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
    
        try { 
            const order = await OrderDetails.findOne({ paymentId: session.id });
            console.log(order)
    
          if (order) {
            order.paymentStatus = 'Completed';
            await order.save();
            console.log(`Order ${order._id} payment status updated to 'Completed'`);
          }
          const email = session.customer_details.email
          console.log(email,'ihtihwhbuh euhIBIUBUBU')
          const user = await User.findOne({ email: email })

          console.log(user,'BHUHWBURBRVURBURBURBHRUGU')
          console.log('SBNIBEIBNINSIBNIBTUBNINIITNBRSUIBNR')

          const userId = user._id
          console.log(user.Id)
          const result = await CartData.deleteOne({ userId: userId });


    
        } catch (error) {
          console.error('Error updating order status:', error);
          res.status(500).send('Server Error');
        }
      } else {
        res.status(200).send({ received: true });
      }




});

exports.router = router