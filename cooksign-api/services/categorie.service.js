const { Op } = require("sequelize");
const { Categorie } = require("../models");

module.exports = {
  FindOrCreate: async (data) => {
    const [categorie, created] = await Categorie.findOrCreate({
      where: data,
      raw: true,
      defaults: {
        ...data,
        isActive: 1,
      },
    });
    return [categorie, created];
  },

  ReadAllByRestaurant: async (id) => {
    const categorie = await Categorie.findAll({
      where: {
        restaurant_id: id,
      },
    });
    return categorie;
  },

  ReadBorneAllByRestaurant: async (id) => {
    const categorie = await Categorie.findAll({
      where: {
        restaurant_id: id,
        isActive: {
          [Op.eq]: 1,
        }
      },
    });
    return categorie;
  },

  Update: async (data) => {
    const [isUpdated] = await Categorie.update(data, {
      where: {
        id: data.id,
      },
    });

    return !!isUpdated;
  },
};
