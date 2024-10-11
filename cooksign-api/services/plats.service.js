const { Op } = require("sequelize");
const { Plat, Image, Ingredient, PlatHasIngredient, Categorie } = require("../models");

module.exports = {
  FindOrCreate: async (data) => {
    const [plat, created] = await Plat.findOrCreate({
      where: {
        name: data.name,
        restaurant_id: data.restaurant_id,
      },
      raw: true,
      defaults: {
        ...data,
        image: `${process.cwd()}/img/${data.image}`
      },
    });
    return [plat, created];
  },

  createDuplicate: async (data) => {
    const plat = await Plat.create(data);
    return plat;
  },

  ReadAllByRestaurant: async (id) => {
    const plats = await Plat.findAll({
      include: [
        {
          model: Image,
          as: 'image',
        },
        {
          model: Ingredient,
          as: 'ingredient',
        },
        {
          model: Categorie,
          as: 'categorie',
        }
      ],
      where: {
        restaurant_id: id,
        active: {
          [Op.eq]: 1,
        },
      },
    });
    return plats;
  },

  ReadAll: async () => {
    const plats = await Plat.findAll();
    return plats;
  },

  FindById: async (id) => {
    const plats = await Plat.findOne({
      include: [{
        model: Image,
        as: 'image',
      }],
      where: {
        id,
      }
    });
    return plats;
  },

  ReadByType: async (data) => {
    const plats = await Plat.findAll({
      include: [
        {
          model: Image,
          as: 'image',
        },
        {
          model: Ingredient,
          as: 'ingredient',
        },
      ],
      where: {
        restaurant_id: data.id,
        type_id: data.type,
      }
    });
    return plats;
  },
  
  Update: async (data) => {
    const [isUpdated] = await Plat.update(data, {
      where: {
        id: data.id,
      },
    });

    return !!isUpdated;
  },

  AddIngredient: async (data) => {
    const [ingredient, created] = await PlatHasIngredient.findOrCreate({
      where: data,
      defaults: data,
    });
    return created;
  },

  DeleteIngredient: async (id) => {
    const deleted = await PlatHasIngredient.destroy({
      where: {
        plat_id: id,
        },
    });
    return deleted;
  },

  DeletePlat: async (menu_id) => {
    const deleted = await PlatHasMenu.destroy({
      where:{
        menu_id,
      },
    });
    return deleted;
  },
};
