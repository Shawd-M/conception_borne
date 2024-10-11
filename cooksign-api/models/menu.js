const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      this.belongsToMany(models.Plat, {
        through: 'PlatHasMenu',
        foreignKey: {
          name: 'menu_id',
          allowNull: false,
        },
        as: 'platHasMenu',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Restaurant, {
        foreignKey: {
          name: 'restaurant_id',
          allowNull: false,
        },
        as: 'restaurant',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      this.hasOne(models.Image, {
        foreignKey: 'id',
        sourceKey: 'image_id',
        as: 'image',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }
  Menu.init({
    id: {
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    restaurant_id: DataTypes.INTEGER,
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    price: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    image_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    active: {
      allowNull: true,
      type: DataTypes.INTEGER,
      default : 1
    },
  }, {
    sequelize,
    modelName: 'Menu',
    tableName: 'menu',

  });
  return Menu;
};
