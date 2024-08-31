const express = require('express')
const router = express.Router()
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)




router.post("/createcheckout",async (req,res)=>{
    const { products , total } = req.body
    console.log(products,total)
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

    res.json({id:session.id})







})


exports.router = router;
