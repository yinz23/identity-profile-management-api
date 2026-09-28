const express = require('express');
const identitiesController = require('../controllers/identitiesController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', verifyToken, identitiesController.userIdentities);
//identity based on requester role
router.get('/:id', verifyToken, identitiesController.contextIdentity);
//create identity
router.post('/', verifyToken, identitiesController.createIdentity);
//update identity
router.put('/:id', verifyToken, identitiesController.updateIdentity);
//delete identity
router.delete('/:id', verifyToken, identitiesController.deleteIdentity);

module.exports = router;