const express = require('express')
const getTokenData = require('../controllers/appController.js')

const router = express.Router()

router.get('/:id', getTokenData.getTokenData)
router.post('/update', getTokenData.getTokenData)

module.exports = {
    router
};