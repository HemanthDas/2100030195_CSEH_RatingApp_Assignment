const express = require("express");
const {
  submitRating,
  getStoreRatings,
  updateRating,
  deleteRating,
} = require("../controllers/ratingController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:storeId", getStoreRatings);
router.post("/", authMiddleware, authorizeRoles("user"), submitRating);
router.put("/:id", authMiddleware, authorizeRoles("user"), updateRating);
router.delete("/:id", authMiddleware, authorizeRoles("user"), deleteRating);

module.exports = router;
