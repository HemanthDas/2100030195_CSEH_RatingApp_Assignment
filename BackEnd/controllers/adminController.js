const { User, Store, Rating, sequelize } = require("../models/index");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    const storeRatings = await Rating.findAll({
      attributes: [
        "store_id",
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
      ],
      group: ["store_id"],
    });
    res.json({ totalUsers, totalStores, totalRatings, storeRatings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    let filter = {};
    if (name) filter.name = { [Op.like]: `%${name}%` };
    if (email) filter.email = { [Op.like]: `%${email}%` };
    if (address) filter.address = { [Op.like]: `%${address}%` };
    if (role) filter.role = role;

    const users = await User.findAll({ where: filter });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
exports.getStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;

    let filter = {};
    if (name) filter.name = { [Op.like]: `%${name}%` };
    if (email) filter.email = { [Op.like]: `%${email}%` };
    if (address) filter.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where: filter,
      include: [
        {
          model: Rating,
          attributes: [
            [sequelize.fn("AVG", sequelize.col("rating")), "avg_rating"],
          ],
        },
      ],
      group: ["Store.id"],
    });

    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stores", error });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
      include: req.user.role === "admin" ? [{ model: Rating }] : [],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
};
