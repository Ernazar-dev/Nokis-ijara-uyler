const { House, User } = require("../models");
const cloudinary = require("cloudinary").v2;

// 1. Adminning o'z uylari
exports.getMyHouses = async (req, res) => {
  try {
    const houses = await House.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Yangi uy qo'shish (limit bilan)
exports.createHouse = async (req, res) => {
  try {
    const count = await House.count({ where: { userId: req.user.id } });

    if (req.user.role !== "superadmin" && count >= req.user.houseLimit) {
      return res.status(403).json({
        message: `Sizdiń limitińiz (max ${req.user.houseLimit} úy) toldı. Super Adminge xabarlasıń.`,
      });
    }

    // Cloudinary rasmlar URL lari (path emas, secure_url)
    const imagePaths = req.files ? req.files.map((f) => f.path) : [];
    const amenitiesList = req.body.amenities
      ? req.body.amenities.split(",")
      : [];

    const house = await House.create({
      ...req.body,
      userId: req.user.id,
      images: imagePaths,
      amenities: amenitiesList,
    });

    res.status(201).json(house);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. Uyni yangilash
exports.updateHouse = async (req, res) => {
  try {
    const house = await House.findByPk(req.params.id);
    if (!house) return res.status(404).json({ message: "Úy tabılmadı" });

    if (house.userId !== req.user.id && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Ruxsat joq" });
    }

    // Yangi rasmlar Cloudinary URL lari
    let newImagePaths = [];
    if (req.files && req.files.length > 0) {
      newImagePaths = req.files.map((f) => f.path);
    }

    const updatedImages = [...(house.images || []), ...newImagePaths];

    let amenitiesList = house.amenities;
    if (req.body.amenities) {
      amenitiesList =
        typeof req.body.amenities === "string"
          ? req.body.amenities.split(",")
          : req.body.amenities;
    }

    await house.update({
      ...req.body,
      images: updatedImages,
      amenities: amenitiesList,
    });

    res.json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. ID bo'yicha bir uy
exports.getHouseById = async (req, res) => {
  try {
    const house = await House.findByPk(req.params.id);
    if (!house) return res.status(404).json({ message: "Not found" });
    res.json(house);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Barcha uylar
exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.findAll({
      include: {
        model: User,
        attributes: ["name", "email"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Uyni o'chirish
exports.deleteHouse = async (req, res) => {
  try {
    const house = await House.findByPk(req.params.id);
    if (!house) return res.status(404).json({ message: "Úy tabılmadı" });

    if (house.userId !== req.user.id && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Bunı óshiriwge huqıqıńız joq" });
    }

    // Cloudinary dan rasmlarni ham o'chiramiz
    if (house.images && house.images.length > 0) {
      const deletePromises = house.images.map((url) => {
        // URL dan public_id ni olamiz: .../nokis-ijara/filename
        const parts = url.split("/");
        const filename = parts[parts.length - 1].split(".")[0];
        const publicId = `nokis-ijara/${filename}`;
        return cloudinary.uploader.destroy(publicId);
      });
      await Promise.allSettled(deletePromises);
    }

    await house.destroy();
    res.json({ message: "Úy óshirildi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Bitta rasmni o'chirish
exports.deleteHouseImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const house = await House.findByPk(id);
    if (!house) return res.status(404).json({ message: "Úy tabılmadı" });

    if (house.userId !== req.user.id && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Ruxsat joq" });
    }

    // Cloudinary dan rasmni o'chirish
    try {
      const parts = imageUrl.split("/");
      const filename = parts[parts.length - 1].split(".")[0];
      const publicId = `nokis-ijara/${filename}`;
      await cloudinary.uploader.destroy(publicId);
    } catch (e) {
      console.error("Cloudinary delete error:", e.message);
    }

    const newImages = house.images.filter((img) => img !== imageUrl);
    house.images = newImages;
    house.changed("images", true);
    await house.save();

    res.json({ message: "Súwret óshirildi", images: newImages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
