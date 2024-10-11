const {
  Model, Joi, errorMessages, ValidateBeforeCreate,
} = require('../helpers/validate');

module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
        this.belongsTo(models.User, {
          foreignKey: 'id',
          sourceKey: 'restaurant_id',
          as: 'users',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.Plat, {
          foreignKey: 'id',
          sourceKey: 'restaurant_id',
          as: 'plat',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.Facture, {
          foreignKey: 'id',
          sourceKey: 'restaurant_id',
          as: 'facture',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.Borne, {
          foreignKey: 'id',
          sourceKey: 'restaurant_id',
          as: 'borne',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.hasMany(models.Menu, {
          foreignKey: {
            name: 'restaurant_id',
            allowNull: true,
          },
          as: 'menu',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.Categorie, {
          foreignKey: 'id',
          sourceKey: 'restaurant_id',
          as: 'categorie',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.hasOne(models.Restaurant_detail, {
          foreignKey: 'id',
          sourceKey: 'detail_id',
          as: 'restaurant_detail',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
      }
  }

  Restaurant.init({
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
    address: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    employee: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    folder: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    detail_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'restaurant',
  });
  return Restaurant;
};
