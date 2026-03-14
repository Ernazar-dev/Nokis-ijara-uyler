const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // <--- 1. BU YERDA QO'SHILDI
const { register, login } = require('../controllers/authController');
const { validateRegister } = require('../middleware/validationMiddleware');

// 2. Login uchun maxsus limit
// 15 daqiqa ichida faqat 5 marta xato qilish mumkin
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    // Xabarni JSON formatida qaytargan ma'qul, frontend tushunishi uchun
    message: { message: "Juda ko'p xato urinish. 15 daqiqadan keyin urinib ko'ring." },
    standardHeaders: true,
    legacyHeaders: false,
});

// 3. Register yo'li (Eskisini o'chirdim, faqat validatsiya borini qoldirdim)
router.post('/register', validateRegister, register);

// 4. Login yo'li (Limit bilan)
router.post('/login', loginLimiter, login);

module.exports = router;