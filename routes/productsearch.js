const express = require('express');
const router = express.Router();
const Product = require('../models/baseModel');
const nlp = require('compromise');


// Define categories and synonyms
const categorySynonyms = {
    Laptop: ['laptop', 'notebook', 'ultrabook'],
    Mobile: ['smartphone', 'mobile', 'phone', 'cellphone'],
    tablet: ['tablet', 'ipad', 'tab'],
    // Add more categories and synonyms as needed
};


const brandSynonyms = {
    apple: ['apple', 'mac', 'iphone', 'ipad'],
    samsung: ['samsung', 'galaxy', 'note'],
    dell: ['dell', 'inspiron', 'xps'],
    asus: ['asus', 'rog', 'zenbook'],
    // Add more brands and synonyms as needed
};



router.get('/search', async (req, res) => {
    const { q } = req.query;
    console.log(q);

    try {
        // Parse the query using Compromise
        const doc = nlp(q);

         // Initialize an array to store detected categories
        let detectedCategories = [];
        let detectedBrands = []
        let priceRange = {};


        // Loop through the categories and check if any synonyms match the query
        for (const [category, synonyms] of Object.entries(categorySynonyms)) {
          console.log("working now");
 
            synonyms.forEach(synonym => {
                if (doc.match(synonym).found) {
                    detectedCategories.push(category);
                }
            });
        }



        for (const [brand, synonyms] of Object.entries(brandSynonyms)) {
          synonyms.forEach(synonym => {
              if (doc.match(synonym).found) {
                  detectedBrands.push(brand);
              }
          });
      }

console.log('brand',detectedBrands)

const pricePatterns = [
    { key: 'min', pattern: ['above', 'over', 'more than', 'greater than'], operator: '$gte' },
    { key: 'max', pattern: ['below', 'under', 'less than'], operator: '$lte' },
    { key: 'between', pattern: ['between'], operator: '$range' },
    { key: 'range', pattern: ['to'], operator: '$range' },
    { key: 'exact', pattern: ['rs', 'rupees', 'dollars', 'bucks'], operator: '$eq' },
];


pricePatterns.forEach(({ pattern, operator }) => {
    pattern.forEach(keyword => {
        const match = doc.match(keyword);

        if (match.found) {
            console.log(`Matched Keyword: ${keyword}`);
            console.log("Match Result:", match.out('text'));

            const queryText = doc.out('text'); // Get the entire query text
            console.log(queryText)
            const numbers = queryText.match(/[0-9]+/g).map(Number);
            console.log(numbers)
 






            
                // Handle ranges like "between X and Y" or "X to Y"
                if (numbers.length === 2) {
                    const [lower, higher] = numbers.sort((a, b) => a - b);
            priceRange.$gte = lower;
            priceRange.$lte = higher;
                }
             else {
                // Handle single value cases
                if (numbers.length === 1) {
                    const priceValue = numbers[0];
            priceRange[operator] = priceValue;
                }
            }
        }
    });
});


        console.log("working now", priceRange);


        // Optional: Remove duplicates
        detectedBrands = [...new Set(detectedBrands)];
   
        detectedCategories = [...new Set(detectedCategories)];


        let query = {};
        if (detectedCategories.length) {
            query.category = { $in: detectedCategories };
        }
        if (detectedBrands.length) {
            query.brand = { $in: detectedBrands };
        }

        if (priceRange.$gte || priceRange.$lte || priceRange.$eq) {
            query.price = {};
            if (priceRange.$gte) {
                query.price.$gte = priceRange.$gte;
            }
            if (priceRange.$lte) {
                query.price.$lte = priceRange.$lte;
            }
            if (priceRange.$eq) {
                query.price.$eq = priceRange.$eq;
            }
        }
        

        const results = await Product.find( query
        );
        res.json( results );
 

console.log(results[0])
console.log("working now dgjgdjddj", query);

        console.log("working sfnow");  
    } catch (err) {
        console.log(err);
        res.status(500).send('error');
    }
});

exports.router = router;
