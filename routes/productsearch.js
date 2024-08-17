const express = require('express')
const router = express.Router()
const Product = require('../models/baseModel')


router.get('/search', async (req,res)=>{
  const { q, brand, screenSize, processor, storage, minPrice, maxPrice } = req.query;
    console.log(req.query.q)

    try{
        const results = await Product.aggregate(
            [
                {
                  '$search': {
                    'index': 'default2', 
                    'autocomplete': {
                      'query': q, 
                      'path': 'name', 
                      'fuzzy': {
                        'maxEdits': 1
                      }
                    }
                  }
                }, {
                  '$match': {
                    ...(brand && { brand }),
                    ...(screenSize && { screenSize }),
                    ...(processor && { processor }),
                    ...(storage && { storage }),
                    price: { $gte: parseInt(minPrice) || 0, $lte: parseInt(maxPrice) || 100000 }
                  }
                }, {
                  '$limit': 7
                }, {
                  '$project': {
                    'name': 1,
                    'price':1,
                    'category':1,
                    'stock':1,
                    'images':1,
                    'brand':1
                  }
                }
              ]
        )
        res.json(results)
        console.log("working")
    } catch (err) {
        console.log(err)
        res.status(500).send('error')
    }
 
})

exports.router = router