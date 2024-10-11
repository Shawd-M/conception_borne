const { Op } = require("sequelize");
const { Ingredient } = require("../models");

module.exports = {
  FindOrCreate: async (data) => {
    const [ingredient, created] = await Ingredient.findOrCreate({
      where: data,
      raw: true,
      defaults: data,
    });
    return [ingredient, created];
  },

  ReadAllByRestaurant: async (id) => {
    const ingredient = await Ingredient.findAll({
      where: {
        restaurant_id: id,
      },
    });
    return ingredient;
  },
};
