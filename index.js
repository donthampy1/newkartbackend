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
const cors = require('cors')



Dbconnect() 
app.use(cors({
    origin: 'http://localhost:5173', // Update with your frontend URL
    credentials: true
}));


app.use(express.json())
app.use('/auth',authRouter.router)
app.use('/addproducts',productRouter.router)
app.use('/autocomplete',autocomplete.router)
app.use('/productsearch',productsearch.router)



app.listen(3000,()=>{
    console.log('listening in port 3000')
})