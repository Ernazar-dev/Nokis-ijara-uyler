const { House, User } = require('../models');
const fs = require('fs');
const path = require('path');

// 1. Adminniń óz úyleri
exports.getMyHouses = async (req, res) => {
    try {
        const houses = await House.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(houses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Jańa úy qosıw (Limit penen)
exports.createHouse = async (req, res) => {
    try {
        // Limit tekseriw
        const count = await House.count({ where: { userId: req.user.id } });

        if (req.user.role !== 'superadmin' && count >= req.user.houseLimit) {
            return res.status(403).json({ 
                message: `Sizdiń limitińiz (max ${req.user.houseLimit} úy) toldı. Super Adminge xabarlasıń.` 
            });
        }

        // Súwretler hám Amenities
        const imagePaths = req.files ? req.files.map(f => f.path.replace(/\\/g, '/')) : [];
        const amenitiesList = req.body.amenities ? req.body.amenities.split(',') : [];

        const house = await House.create({
            ...req.body,
            userId: req.user.id,
            images: imagePaths,
            amenities: amenitiesList
        });
        
        res.status(201).json(house);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3. Úydi ózgertiw (Update)
exports.updateHouse = async (req, res) => {
    try {
        const house = await House.findByPk(req.params.id);

        if (!house) return res.status(404).json({ message: 'Úy tabılmadı' });
        
        // Ruxsat tekseriw
        if (house.userId !== req.user.id && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Ruxsat joq' });
        }

        // 1. Jańa súwretler bar ma?
        let newImagePaths = [];
        if (req.files && req.files.length > 0) {
           newImagePaths = req.files.map(f => f.path.replace(/\\/g, '/'));
        }

        // 2. Eski súwretlerge jańaların qosamız (Append)
        // house.images bul PostgreSQL array
        const updatedImages = [...(house.images || []), ...newImagePaths];

        // 3. Amenities (Qolaylıqlar)
        // FormData-dan 'Wifi, Gaz' string bolıp kelse, array qılamız
        let amenitiesList = house.amenities;
        if (req.body.amenities) {
            amenitiesList = typeof req.body.amenities === 'string' 
                ? req.body.amenities.split(',') 
                : req.body.amenities;
        }

        // 4. Update (Maǵlıwmatlar + Súwretler)
        await house.update({
            ...req.body,
            images: updatedImages, // Jańalanǵan súwretler dizimi
            amenities: amenitiesList
        });

        res.json(house);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// 4. Bir úydi alıw (Edit ushın)
exports.getHouseById = async (req, res) => {
    try {
        const house = await House.findByPk(req.params.id);
        if(!house) return res.status(404).json({message: 'Not found'});
        res.json(house);
    } catch (err) { res.status(500).json({message: err.message}); }
};

// 5. Barlıq úylerdi alıw (Client ushın)
exports.getAllHouses = async (req, res) => {
    try {
        const houses = await House.findAll({
            include: {
                model: User,
                attributes: ['name', 'email']
            }
        });
        res.json(houses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Úydi óshiriw
exports.deleteHouse = async (req, res) => {
    try {
        const house = await House.findByPk(req.params.id);

        if (!house) return res.status(404).json({ message: 'Úy tabılmadı' });

        if (house.userId !== req.user.id && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Bunı óshiriwge huqıqıńız joq' });
        }

        await house.destroy();
        res.json({ message: 'Úy óshirildi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteHouseImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body; // Óshiriletuǵın súwrettiń atı

        const house = await House.findByPk(id);
        if (!house) return res.status(404).json({ message: 'Úy tabılmadı' });

        // User tekseriw
        if (house.userId !== req.user.id && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Ruxsat joq' });
        }

        // Bazadan súwret atın alıp taslaw
        const newImages = house.images.filter(img => img !== imageUrl);
        
        // Fayldı fizikalıq túrde diskten óshiriw (optional)
        const filePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Bazanı jańalaw (Sequelize array update)
        // Dıqqat: Array update ushın `changed` shaqırıw kerek bolıwı múmkin
        house.images = newImages;
        house.changed('images', true);
        await house.save();

        res.json({ message: 'Súwret óshirildi', images: newImages });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};