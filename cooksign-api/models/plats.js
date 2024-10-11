const {
  Model, Joi, errorMessages, ValidateBeforeCreate,
} = require('../helpers/validate');

module.exports = (sequelize, DataTypes) => {
  class Plat extends Model {
    static associate(models) {
        this.hasOne(models.Restaurant, {
          foreignKey: 'id',
          sourceKey: 'restaurant_id',
          as: 'restaurant',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsToMany(models.Menu, {
          through: 'PlatHasMenu',
          foreignKey: {
            name: 'plat_id',
            allowNull: true,
          },
          as: 'menu',
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
        this.belongsToMany(models.Ingredient, {
          through: 'PlatHasIngredient',
          foreignKey: {
            name: 'plat_id',
            allowNull: true,
          },
          as: 'ingredient',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.hasOne(models.Categorie, {
          foreignKey: 'id',
          sourceKey: 'type_id',
          as: 'categorie',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
      }
  }

  Plat.init({
    id: {
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
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
    restaurant_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    type_id: {
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
    modelName: 'Plat',
    tableName: 'plat',
  });
  return Plat;
};
