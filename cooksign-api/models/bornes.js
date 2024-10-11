const bcrypt = require('bcrypt');
const {
  Model,
  Joi,
  errorMessages,
  ValidateBeforeCreate,
} = require("../helpers/validate");

module.exports = (sequelize, DataTypes) => {
  class Borne extends Model {
    static associate(models) {
      this.hasMany(models.Restaurant, {
        foreignKey: "id",
        sourceKey: "restaurant_id",
        as: "restaurant",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

  Borne.init(
    {
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
      code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      image_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.INTEGER,
      },
      nextMaintenance: {
        type: DataTypes.DATEONLY,
      },
      previousMaintenance: {
        type: DataTypes.DATEONLY,
      },
      serieNum: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Borne",
      tableName: "borne",
    }
  );

  Borne.beforeCreate(async (borne) => {
    borne.code = await bcrypt.hash(borne.code, 10);
  });

  return Borne;
};
