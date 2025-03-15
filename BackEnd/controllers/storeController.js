const { Store, Rating, User } = require("../models/index");
const { Op, Sequelize } = require("sequelize");
exports.createStore = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      ownerId,
      ownerName,
      ownerEmail,
      ownerPassword,
    } = req.body;

    let storeOwner = await User.findByPk(ownerId);

    if (!storeOwner && ownerName && ownerEmail && ownerPassword) {
      storeOwner = await User.create({
        name: ownerName,
        email: ownerEmail,
        password_hash: ownerPassword,
        address: address,
        role: "store_owner",
      });
    }

    if (!storeOwner) {
      return res.status(400).json({ message: "Store owner is required." });
    }
    const store = await Store.create({
      name,
      email,
      address,
      owner_id: storeOwner.dataValues.id,
    });

    res.status(201).json(store);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating store", error });
  }
};
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving stores", error });
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
      attributes: [
        "id",
        "name",
        "email",
        "address",
        [Sequelize.fn("AVG", Sequelize.col("Ratings.rating")), "avgRating"],
      ],
      include: [
        {
          model: Rating,
          attributes: [],
        },
      ],
      group: ["Store.id"],
    });

    res.json(stores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving stores", error });
  }
};
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    res.json(store);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving store", error });
  }
};
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    await store.update(req.body);
    res.json({ message: "Store updated successfully", store });
  } catch (error) {
    res.status(500).json({ message: "Error updating store", error });
  }
};
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    await store.destroy();
    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting store", error });
  }
};
