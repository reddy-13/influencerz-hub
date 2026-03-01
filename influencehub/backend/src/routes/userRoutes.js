const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/me', protect, userController.getMe);
router.get('/admin-metrics', protect, userController.getAdminMetrics);
router.put('/:id/status', protect, userController.updateUserStatus);

module.exports = router;