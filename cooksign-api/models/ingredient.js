const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    static associate(models) {
      this.belongsToMany(models.Plat, {
        through: 'PlatHasIngredient',
        foreignKey: {
          name: 'ingredient_id',
          allowNull: false,
        },
        as: 'platHasIngredient',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }
  Ingredient.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    icon: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    restaurant_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    tableName: 'ingredient',
    modelName: 'Ingredient',
  });
  return Ingredient;
};
