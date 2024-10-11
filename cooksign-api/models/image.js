const {
  Model, Joi, errorMessages, ValidateBeforeCreate,
} = require('../helpers/validate');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      this.belongsTo(models.Plat, {
        foreignKey: {
          name: 'plat_id',
          allowNull: false,
        },
        as: 'plat',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Menu, {
        foreignKey: {
          name: 'menu_id',
          allowNull: false,
        },
        as: 'menu',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  Image.init({
    id: {
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    plat_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    menu_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    image_id: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Image',
    tableName: 'image',
  });
  return Image;
};
