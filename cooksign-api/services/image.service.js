const { Op } = require("sequelize");
const { Image, Plat } = require("../models");

module.exports = {
  FindOrCreate: async (data) => {
    const [image, created] = await Image.findOrCreate({
      where: {
        image_id: data.image_id,
      },
      raw: true,
      defaults: data,
    });
    return [image, created];
  },

  FindByImageId: async (id) => {
    const image = await Image.findOne({
      where: {
        id,
      },
    });
    return image;
  },

  UpdateByImageId: async (data, plat) => {
    const { id, ...item } = data;

    if (id !== '16dJbxhlXEqK9F4CUS0dMDcrFnQFCP_nF') {
      const [isUpdated] = await Image.update(item, {
        where: {
          image_id: id,
        },
      });

      return !!isUpdated;
    } else {
      console.log("icicicicicic")
      const image = await Image.create({
        name: data.name,
        image_id: data.image_id,
        url: data.url,
      });
      console.log("icicicicicic")
      const [isUpdated] = await Plat.update({image_id: parseInt(image.id)}, {
        where: {
          id: plat.id,
        },
      });
  
      return !!isUpdated;
    }
  },
};
