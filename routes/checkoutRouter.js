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

    const newOrderDetail = new OrderDetails({
        userId,
        products: products.map((product)=>({
            productId: product.productId ,
            quantity: product.quantity || 1,
            productName: product.productName,
            productThumbnail: product.productThumbnail 

        })),

        totalPrice : total,
        shippingDetails: shippingDetails,
        orderStatus: 'Pending',
        paymentStatus: 'Pending'

    })





    await newOrderDetail.save()
    console.log('orderdetails saved successfully')




    res.json({id:session.id})


   }catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });

   }





})


exports.router = router;
