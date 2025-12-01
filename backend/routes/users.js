const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { verifyToken } = require('../middleware/middleware');

router.get('/:id', verifyToken, usersController.getUserProfile);

module.exports = router;