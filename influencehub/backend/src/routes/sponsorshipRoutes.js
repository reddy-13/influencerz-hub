const express = require('express');
const sponsorshipController = require('../controllers/sponsorshipController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect);

// Sponsorship routes
router.post('/create', sponsorshipController.createSponsorship);
router.get('/', sponsorshipController.getSponsorships);

module.exports = router;