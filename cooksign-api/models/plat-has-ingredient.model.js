const {
    Model,
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class PlatHasIngredient extends Model {
      static associate() {
      }
    }
    PlatHasIngredient.init({
      plat_id: DataTypes.INTEGER,
      ingredient_id: DataTypes.INTEGER,
      // quantity: DataTypes.FLOAT,
    }, {
      sequelize,
      modelName: 'PlatHasIngredient',
      tableName: 'plat_has_ingredient',
  
    });
    return PlatHasIngredient;
  };
  