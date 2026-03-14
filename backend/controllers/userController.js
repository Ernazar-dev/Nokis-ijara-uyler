const { User } = require('../models');
const bcrypt = require('bcryptjs');
// 1. Barlıq userlerdi alıw (Super Admin ushın)
exports.getAllUsers = async (req, res) => {
    try {
        // Parolın kórsetpew ushın { exclude: ['password'] } qılamız
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Userdiń Roli hám Limitin ózgertiw
exports.updateUserRole = async (req, res) => {
    try {
        const { role, houseLimit } = req.body; 
        // Frontendten mınaday keledi: { role: 'admin', houseLimit: 10 }
        
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Paydalanıwshı tabılmadı' });
        }

        // Maǵlıwmatlardı jańalaw
        if (role) user.role = role;
        if (houseLimit) user.houseLimit = houseLimit;

        await user.save();

        res.json({ message: 'Paydalanıwshı jańalandı', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 3. Userdi óshiriw
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Paydalanıwshı tabılmadı' });
        }

        // Ózińizdi óshire almaysız (qáwipsizlik)
        if (req.user.id === user.id) {
            return res.status(400).json({ message: "Óz akkauntıńızdı óshire almaysız!" });
        }

        await user.destroy(); // Userdi hám onıń úylerin óshiredi (Cascade)
        
        res.json({ message: 'Paydalanıwshı óshirildi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 4. Paroldi ózgertiw (Super Admin tárepinen)
exports.updateUserPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Paydalanıwshı tabılmadı' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Parol 6 belgiden az bolmawı kerek' });
        }

        // Paroldi shifrlaw
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.json({ message: 'Parol tabıslı ózgertildi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};