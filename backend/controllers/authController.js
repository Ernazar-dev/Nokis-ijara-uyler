const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Token jaratıw funkciyası
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Token 30 kúnge jaramlı
    });
};

// 1. REGISTRACIYA
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // User bar ekenin tekseriw
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Bul email menen paydalanıwshı bar' });
        }

        // Paroldı shifrlaw
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Bazaga jazıw (Role avtomat 'client' boladı)
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Juwap qaytarıw
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. LOGIN (Kiriw)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Userdi tabıw
        const user = await User.findOne({ where: { email } });

        // User bar ma hám paroli durıs pa?
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role)
            });
        } else {
            res.status(401).json({ message: 'Email yamasa parol qáte' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};