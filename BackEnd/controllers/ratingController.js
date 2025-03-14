const { Rating, Store } = require("../models/index");

exports.submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;

    const existingRating = await Rating.findOne({
      where: { user_id: req.user.userId, store_id },
    });
    if (existingRating) {
      return res.status(400).json({
        message:
          "You have already rated this store. Update your rating instead.",
      });
    }

    const newRating = await Rating.create({
      user_id: req.user.userId,
      store_id,
      rating,
    });

    res
      .status(201)
      .json({ message: "Rating submitted successfully", rating: newRating });
  } catch (error) {
    res.status(500).json({ message: "Error submitting rating", error });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const { id } = req.params;

    const userRating = await Rating.findOne({
      where: { id, user_id: req.user.userId },
    });
    if (!userRating) {
      return res.status(404).json({
        message: "Rating not found or you don't have permission to update it.",
      });
    }

    await userRating.update({ rating });
    res.json({ message: "Rating updated successfully", rating: userRating });
  } catch (error) {
    res.status(500).json({ message: "Error updating rating", error });
  }
};
exports.getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;

    const ratings = await Rating.findAll({ where: { store_id: storeId } });
    if (!ratings.length) {
      return res
        .status(404)
        .json({ message: "No ratings found for this store." });
    }

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving ratings", error });
  }
};
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    // Find rating
    const userRating = await Rating.findOne({
      where: { id, user_id: req.user.userId },
    });
    if (!userRating) {
      return res.status(404).json({
        message: "Rating not found or you don't have permission to delete it.",
      });
    }

    await userRating.destroy();
    res.json({ message: "Rating deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting rating", error });
  }
};
