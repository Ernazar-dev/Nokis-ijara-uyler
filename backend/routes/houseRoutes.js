const express = require("express");
const router = express.Router();

// 1. Controllerdan hámme funksiyalardı alıw
const {
  createHouse,
  getAllHouses,
  deleteHouse,
  getMyHouses,
  updateHouse,
  getHouseById,
  deleteHouseImage, // Súwret óshiriw funksiyası
} = require("../controllers/houseController");

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// === MARSHRUTLAR ===

// 1. Barlıq úylerdi alıw (Karta hám Home sahifası ushın)
// Hamme ushın ashıq
router.get("/", getAllHouses);

// 2. Adminniń óz úyleri (DIQQAT: Bul /:id dan joqarıda turıwı shárt!)
router.get("/my", protect, authorize("admin", "superadmin"), getMyHouses);

// 3. ID arqalı bir úydi alıw (Maǵlıwmatlar beti yamasa Edit beti ushın)
router.get("/:id", getHouseById);

// 4. Jańa úy qosıw (Adminler ushın, max 7 súwret)
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  upload.array("images", 7),
  createHouse,
);

// 5. Úydi ózgertiw (Rasm qosıw yamasa maǵlıwmatlardı jańalaw)
// PUT isletemiz, bir marshrut hámme nársege juwap beredi
router.put(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  upload.array("images", 7),
  updateHouse,
);

// 6. Úy súwretlerin bittadan óshiriw
// POST isletiw qolaylı, sebebi keste emes, obyekt ishindegi array ózgerip atır
router.post(
  "/:id/delete-image",
  protect,
  authorize("admin", "superadmin"),
  deleteHouseImage,
);

// 7. Úydi tolıq óshiriw
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteHouse);

module.exports = router;
