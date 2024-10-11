const { Op } = require("sequelize");
// Model avec S a la fin = model Indiv
const { Borne, Image } = require("../models");

module.exports = {

   /**
   * Verifie si une borne existe à partir de son id ou de son login et le retourne
   * @param data
   * @returns {Promise<Model<any, TModelAttributes>>}
   * @constructor
   */
    FindBorne: async (data) => {
      const borne = await Borne.findOne({
        where: {
          [Op.or]: [
            { serieNum: data },
            { id: data },
          ],
        },
      });
      return borne;
    },

  FindOrCreate: async (data) => {
    const [borne, created] = await Borne.findOrCreate({
      where: data,
      raw: true,
      defaults: data,
    });
    return [borne, created];
  },

  ReadAll: async () => {
    const borne = await Borne.findAll(
      {
        include: [
          {
            model: Image,
            as: "image",
          },
        ],
      },
    );
    return borne;
  },

  ReadAllByRestaurant: async (id) => {
    const borne = await Borne.findAll({
      include: [
        {
          model: Image,
          as: "image",
        },
      ],
      where: {
        restaurant_id: id,
      },
    });
    return borne;
  },

  Update: async (data) => {
    const [isUpdated] = await Borne.update(data, {
      where: {
        id: data.id,
      },
    });

    return !!isUpdated;
  },
};
