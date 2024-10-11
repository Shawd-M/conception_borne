const { Op } = require("sequelize");
// Model avec S a la fin = model Indiv
const { Restaurant, Restaurant_detail } = require("../models");

module.exports = {
  FindOrCreate: async (data) => {
    const [restaurant, created] = await Restaurant.findOrCreate({
      where: {
        name: data.name,
        address: data.address,
      },
      raw: true,
      defaults: data,
    });
    return [restaurant, created];
  },

  Read: async (id) => {
    const restaurant = await Restaurant.findOne({
      include: [
        {
          model: Restaurant_detail,
          as: "restaurant_detail",
        },
      ],
      where: { id },
    });

    if (!restaurant) {
      return -1;
    }

    return restaurant;
  },

  ReadAll: async () => {
    const restaurant = await Restaurant.findAll({
      include: [
        {
          model: Restaurant_detail,
          as: "restaurant_detail",
        },
      ]
    });
    return restaurant;
  },

  Update: async (data) => {
    const [isUpdated] = await Restaurant.update(data, {
      where: {
        id: data.id,
      },
    });

    return !!isUpdated;
  },
};
