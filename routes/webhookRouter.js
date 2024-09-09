const express = require('express')
const router = express.Router()
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const OrderDetails = require ('../models/orderDetailsModel')


router.post('/', express.raw({ type: 'application/json' }), (req, res) => {
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

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
});

exports.router = router