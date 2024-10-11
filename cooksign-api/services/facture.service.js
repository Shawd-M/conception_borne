const { Op } = require("sequelize");
const { Facture } = require("../models");

module.exports = {
  Create: async (data) => {
    const response = await Facture.create(data);
    return response;
  },

  ReadAllByRestaurant: async (id) => {
    const facture = await Facture.findAll({
      where: {
        restaurant_id: id,
        active: {
          [Op.eq] : 1
        }
      },
    });
    return facture;
  },

  Update: async (data) => {
    const [isUpdated] = await Facture.update(data, {
      where: {
        id: data.id,
      },
    });

    return !!isUpdated;
  },
};
