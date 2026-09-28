const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

//register
router.post('/register', usersController.registerUser);
//login
router.post('/login', usersController.loginUser);

module.exports = router;