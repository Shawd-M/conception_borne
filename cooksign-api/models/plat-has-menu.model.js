const {
    Model,
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class PlatHasMenu extends Model {
      static associate() {}
    }
    PlatHasMenu.init({
      plat_id: DataTypes.INTEGER,
      menu_id: DataTypes.INTEGER,
      PlatHasMenuId: DataTypes.INTEGER,
    }, {
      sequelize,
      modelName: 'PlatHasMenu',
      tableName: 'plat_has_menu',
  
    });
    return PlatHasMenu;
  };
  