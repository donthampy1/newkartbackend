const mongoose = require('mongoose')
require('dotenv').config()


//9NiRk459EQwFpG7Y

async function Dbconnect() {
    try {
        await mongoose.connect(process.env.MONGOURI)
        console.log('DB connected ')
    } catch (err) {
        console.log('DBconnection error', err)
    }
}

module.exports = Dbconnect;
