const express = require("express");
const {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
} = require("../controllers/storeController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getStores);
router.get("/:id", getStoreById);

router.post("/", authMiddleware, authorizeRoles("admin"), createStore);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateStore);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteStore);

module.exports = router;
