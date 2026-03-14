const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 1. Token tekshirish
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: "Avtorizatsiyadan o'tmagan siz" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token topilmadi' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token xato yoki muddati o'tgan" });
    }
};

// 2. Rol tekshirish
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Sizning rolingiz (${req.user?.role}) bu amalni bajarishga ruxsat yo'q`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
