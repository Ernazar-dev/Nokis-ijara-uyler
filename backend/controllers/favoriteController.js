const { Favorite, House, User } = require("../models");

// 1. Like/Unlike (O'zgertilmeydi)
exports.toggleFavorite = async (req, res) => {
  try {
    const { houseId } = req.body;
    const userId = req.user.id;

    const existing = await Favorite.findOne({ where: { userId, houseId } });

    if (existing) {
      await existing.destroy();
      return res.json({ message: "Unlike", status: false });
    } else {
      await Favorite.create({ userId, houseId });
      return res.json({ message: "Like", status: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. FAVORITES ALIW (OŃLANǴAN)
exports.getMyFavorites = async (req, res) => {
  try {
    // Userdi tabamız hám oǵan baylanısqan (LikedHouses) úylerdi qosıp alamız
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: House,
          as: "LikedHouses", // models/index.js daǵı alias penen birdey bolıwı SHÁRT
          through: { attributes: [] }, // Aralıq keste (Favorite) maǵlıwmatı kerek emes
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User tabılmadı" });
    }

    // Tek ǵana úyler dizimin qaytaramız
    res.json(user.LikedHouses);
  } catch (error) {
    console.error("Favorite Error:", error);
    res.status(500).json({ message: "Server qáteligi: " + error.message });
  }
};
