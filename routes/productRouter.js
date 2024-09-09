const express = require('express');
const laptopRouter = require('./newlap.js')
const mobilerouter = require('./newmob.js')
const tabletRouter = require('./newtab.js')
const televisionRouter = require('./newtv.js')

const router = express.Router();

router.use('/laptop', laptopRouter.router);
router.use('/mobile',mobilerouter.router)
router.use('/tablet',tabletRouter.router )
router.use('/television',televisionRouter.router)
exports.router = router
