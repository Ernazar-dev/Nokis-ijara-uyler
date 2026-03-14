const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateUserPassword,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Bul jollardıń hámmesine tek 'superadmin' kire aladı!
router.use(protect);
router.use(authorize("superadmin"));

router.get("/", getAllUsers);

// 2. Rol hám Limitti ózgertiw
router.put("/:id", updateUserRole);

// 3. Paroldi ózgertiw (JAŃA)
// Frontendte: axios.put(`/api/users/${id}/password`)
router.put("/:id/password", updateUserPassword);

// 4. Userdi óshiriw (JAŃA)
// Frontendte: axios.delete(`/api/users/${id}`)
router.delete("/:id", deleteUser);
module.exports = router;
