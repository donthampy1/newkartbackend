const express = require('express')
const router = express.Router()
const Product = require('../models/baseModel')


router.get('/search', async (req,res)=>{
    const query =req.query.q
    console.log(req.query.q,"activating")

    try{
        const results = await Product.aggregate(
          [
            {
              '$search': {
                'index': 'default2', 
                'autocomplete': {
                  'query': query, 
                  'path': 'name'
                }
              }
            }, {
              '$project': {
                '_id': 1, 
                'name': 1, 
                'score': {
                  '$meta': 'searchScore'
                }
              }
            }, {
              '$match': {
                'score': {
                  '$gt': 1
                }
              }
            }, {
              '$limit': 8
            }
          ]
        )
        res.json(results)
        console.log("working",results)
    } catch (err) {
        console.log(err)
        res.status(500).send('error')
    }
 
})

exports.router = router