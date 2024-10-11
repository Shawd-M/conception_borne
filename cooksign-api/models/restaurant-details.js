const {
  Model, Joi, errorMessages, ValidateBeforeCreate,
} = require('../helpers/validate');

module.exports = (sequelize, DataTypes) => {
  class Restaurant_detail extends Model {
    static associate(models) {
        this.belongsTo(models.Restaurant, {
          foreignKey: 'id',
          sourceKey: 'restaurant_id',
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

  Restaurant_detail.init({
    id: {
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    restaurant_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    color: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    colorAdmin: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    colorText: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    image_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Restaurant_detail',
    tableName: 'restaurant_details',
  });
  return Restaurant_detail;
};
