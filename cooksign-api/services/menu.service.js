const { Op } = require("sequelize");
const { Menu, PlatHasMenu, Plat, Image } = require("../models");

module.exports = {
  FindOrCreate: async (data) => {
    const [menu, created] = await Menu.findOrCreate({
      where: {
        name: data.name,
        restaurant_id: data.restaurant_id,
      },
      raw: true,
      defaults: data,
    });
    return [menu, created];
  },

  AddPlat: async (data) => {
    const [plat, created] = await PlatHasMenu.findOrCreate({
      where:{
        plat_id: data.id,
        menu_id: data.menu,
        PlatHasMenuId: data.menu,
      },
      raw: true,
      defaults:       {
        plat_id: data.id,
        menu_id: data.menu,
        PlatHasMenuId: data.menu,
      },
    });
    return [plat, created];
  },

  DeletePlat: async (menu_id) => {
    const deleted = await PlatHasMenu.destroy({
      where:{
        menu_id,
      },
    });
    return deleted;
  },

  ReadAllByRestaurant: async (id) => {
    const menu = await Menu.findAll({
      where: {
        restaurant_id: id,
        active: {
          [Op.eq] : 1,
        }
      },
      include: [
        {
          model: Plat,
          as: 'platHasMenu',
          include: [{
            model: Image,
            as: 'image',
          }],
          where: {
            active: {
              [Op.eq] : 1,
            }
          }
        },
        {
          model: Image,
          as: 'image',
        }
      ],
    });
    return menu;
  },

  ReadAll: async () => {
    const menu = await Menu.findAll();
    return menu;
  },

  FindById: async (id) => {
    const menu = await Menu.findOne({
      include: [
        {
          model: Plat,
          as: 'platHasMenu',
          where: {
            active: {
              [Op.eq] : 1,
            }
          }
        },
        {
          model: Image,
          as: 'image',
        }
      ],
      where: {
        id,
      }
    });
    return menu;
  },

  Update: async (data) => {
    const [isUpdated] = await Menu.update(data, {
      where: {
        id: data.id,
      },
    });

    return !!isUpdated;
  },

  createDuplicate: async (data) => {
    const menu = await Menu.create(data);
    return menu;
  },
};
