const express = require('express');
const videoController = require('../controllers/videoController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect);

// Video routes
router.post('/upload', videoController.uploadVideo);
router.get('/', videoController.getVideos);

module.exports = router;