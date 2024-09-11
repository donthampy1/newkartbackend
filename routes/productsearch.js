const express = require('express');
const router = express.Router();
const Product = require('../models/baseModel');
const nlp = require('compromise');


// Define categories and synonyms
const categorySynonyms = {
    Laptop: ['laptop', 'notebook', 'ultrabook','laptops'],
    Mobile: ['smartphone', 'mobile', 'phone', 'cellphone','mobiles','smartphones'],
    Tablet: ['tablet', 'ipad', 'tab','tablets'],
    Television:['tv','Television','display','tvs']
}; 


const brandSynonyms = {
    apple: ['apple', 'mac', 'iphone', 'ipad'],
    samsung: ['samsung', 'galaxy', 'note'],
    dell: ['dell', 'inspiron', 'xps'],
    asus: ['asus', 'rog', 'zenbook'],
    lenovo : ['Lenovo','thinkpad','yoga'],
    hp : ['hp','HP'],
    msi : ['msi','katana'],
    xiaomi : ['xiaomi','redmi'],
    itel : ['itel']
};



router.get('/search', async (req, res) => {
    const { q } = req.query;
    console.log(q);

    try {
        const doc = nlp(q);

        let detectedCategories = [];
        let detectedBrands = []
        let priceRange = {};


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

            const queryText = doc.out('text'); 
            console.log(queryText)
            const numbers = queryText.match(/[0-9]+/g).map(Number);
            console.log(numbers)
 






            
                if (numbers.length === 2) {
                    const [lower, higher] = numbers.sort((a, b) => a - b);
            priceRange.$gte = lower;
            priceRange.$lte = higher;
                }
             else {
                if (numbers.length === 1) {
                    const priceValue = numbers[0];
            priceRange[operator] = priceValue;
                }
            }
        }
    });
});


        console.log("working now", priceRange);


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
        console.log(query)
 

console.log(results[0])
console.log("working now dgjgdjddj", query);

        console.log("working sfnow");  
    } catch (err) {
        console.log(err);
        res.status(500).send('error');
    }
});





router.get('/searchauto', async (req,res)=>{
    const query =req.query.q
    console.log(query,"activating")

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
                    'brand': 1, 
                    'category': 1, 
                    'price': 1, 
                    'name': 1, 
                    'rating': 1, 
                    'images': 1, 
                    'score': {
                      '$meta': 'searchScore'
                    }
                  }
                }, {
                  '$match': {
                    'score': {
                      '$gte': 5
                    }
                  }
                }, {
                  '$limit': 10
                }
              ]
        )
        res.json(results)
        console.log(results)
    } catch (err) {
        console.log(err)
        res.status(500).send('error')
    }
 
})


router.get('/filter', async (req, res) => {
    const { minPrice , maxPrice, brand, batteryCapacity , screenSize, processor, storage, category, ram, technology, resolution} = req.query;
    console.log(ram,"this is thisnis")
console.log(req.query,"this is from server")
console.log(minPrice,maxPrice)
    try {
        let query = {};

        if (category) {
            query.category = { $in: category.split(',') }
        }

        if (brand) {
            query.brand = { $in: brand.split(',') }
        }

        if (screenSize) {
            query.screenSize = { $in: screenSize.split(',') }
        }

        if (processor) {
            query.processor = { $in: processor.split(',') }
        }

        if (storage) {
            query.storage = { $in: storage.split(',') }
        }

        if (batteryCapacity) {
            query.batteryCapacity = { $in: batteryCapacity.split(',') }
        }

        if (ram) {
            query.ram = { $in: ram.split(',') }
        }

        if (resolution) {
            query.resolution = { $in: resolution.split(',') }
        }

        if (technology) {
            query.technology = { $in: technology.split(',') }
        }



        if (minPrice && maxPrice) {
           
            query.price = {
                $gte: minPrice,
                $lte: maxPrice,
            };
        }
console.log('this is query',query)
        const results = await Product.find(query);

        res.json(results);
        //console.log(results)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});




















exports.router = router;
