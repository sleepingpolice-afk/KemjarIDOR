const express = require('express')
const router = express.Router()
const { getUser } = require('../controllers/usersController')

// Vulnerable route: no authentication or authorization checks
router.get('/:id', getUser)

module.exports = router
