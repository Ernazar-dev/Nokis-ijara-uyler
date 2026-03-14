const express = require('express');
const router = express.Router();
const { toggleFavorite, getMyFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/toggle', protect, toggleFavorite); // Like basıw
router.get('/', protect, getMyFavorites);        // Dizimdi alıw

module.exports = router;