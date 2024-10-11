const {
  Model, Joi, errorMessages, ValidateBeforeCreate,
} = require('../helpers/validate');

module.exports = (sequelize, DataTypes) => {
  class Facture extends Model {
    static associate(models) {
        this.hasMany(models.Restaurant, {
          foreignKey: 'id',
          sourceKey: 'restaurant_id',
          as: 'restaurant',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
      }
  }

  Facture.init({
    id: {
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    restaurant_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    order: {
      allowNull: false,
      type: DataTypes.JSON,
    },
    totalPrice: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    active: {
      allowNull: true,
      type: DataTypes.INTEGER,
      default : 1
    },
  }, {
    sequelize,
    modelName: 'Facture',
    tableName: 'factures',
  });
  return Facture;
};
