const { Op } = require("sequelize");
const { Restaurant_detail, Image } = require("../models");

module.exports = {
  FindOrCreate: async (data) => {
    data.image_id = 2;
    const [restaurant_detail, created] = await Restaurant_detail.findOrCreate({
      where: data,
      raw: true,
      defaults: data,
    });
    return [restaurant_detail, created];
  },

  Read: async (data) => {
    const restaurant_detail = await Restaurant_detail.findOne({
      include: [
        {
          model: Image,
          as: "image",
        },
      ],
      where: {
        id: data,
      },
    });

    return restaurant_detail;
  },

  UpdateById: async (id, data) => {
    const [isUpdated] = await Restaurant_detail.update(data, {
      where: {
        id,
      },
    });

    return !!isUpdated;
  },
};
