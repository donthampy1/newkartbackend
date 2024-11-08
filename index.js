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
const sellerRouter = require('./routes/sellerRouter.js')
const adminRouter = require('./routes/adminauthRouter.js')
const adminpanelRouter = require('./routes/adminpanelRoutes.js')
const webhookRouter = require('./routes/webhookRouter.js')
const orderRouter = require('./routes/orderRoutes.js')
const analyticsRouter = require('./routes/analyticsRouter.js')
const cors = require('cors')




Dbconnect() 


const allowedOrigins = [
  'https://newkartfrontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://newkartadmin.vercel.app',  
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS')); 
    } 
  },
  credentials: true 
}));
 


app.use('/webhook', webhookRouter.router);




app.use(express.json())
app.use('/auth',authRouter.router)
app.use('/addproducts',productRouter.router)
app.use('/autocomplete',autocomplete.router)
app.use('/productsearch',productsearch.router)
app.use('/getproductdata',getproductdata.router)
app.use('/cart',cartRouter.router)
app.use('/checkout',checkoutRouter.router)
app.use('/sellerproduct',sellerRouter.router)
app.use('/adminauth',adminRouter.router)
app.use('/adminpanelroutes',adminpanelRouter.router)
app.use('/orders',orderRouter.router)
app.use('/analytics',analyticsRouter.router)
app.get('/initialize', (req, res) => {
  res.status(200).json({ message: 'initialized'})
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
