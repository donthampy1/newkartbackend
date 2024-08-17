const express = require('express');
const laptopRouter = require('./newlap.js')
const mobilerouter = require('./newmob.js')

const router = express.Router();

router.use('/laptop', laptopRouter.router);
router.use('/mobile',mobilerouter.router)

exports.router = router;
