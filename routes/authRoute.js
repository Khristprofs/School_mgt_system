const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_view.js');
const refreshController = require('../controllers/refresh_view.js');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', refreshController.handleRefreshToken);

module.exports = router;