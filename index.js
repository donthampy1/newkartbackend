const express = require('express')
const app =express()
const mongoose = require('mongoose')
const Dbconnect = require ('./config/db.js')
require('dotenv').config()
const userRouter = require('./routes/userRouter.js')
const authRouter = require('./routes/authRouter.js')
const productRouter = require('./routes/productRouter.js')
const autocomplete = require('./routes/autocomplete.js')
const productsearch = require('./routes/productsearch.js')
const getproductdata = require('./routes/getproductdata.js')
const cartRouter = require('./routes/cartRouter.js')
const checkoutRouter = require('./routes/checkoutRouter.js')
const cors = require('cors')



Dbconnect() 
const allowedOrigins = [
    'https://newkartfrontend.vercel.app',
  ];
  
  app.use(cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));
 

app.use(express.json())
app.use('/auth',authRouter.router)
app.use('/addproducts',productRouter.router)
app.use('/autocomplete',autocomplete.router)
app.use('/productsearch',productsearch.router)
app.use('/getproductdata',getproductdata.router)
app.use('/cart',cartRouter.router)
app.use('/checkout',checkoutRouter.router)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
