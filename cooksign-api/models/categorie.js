const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Categorie extends Model {
    static associate(models) {
      this.hasOne(models.Restaurant, {
        foreignKey: 'id',
        sourceKey: 'restaurant_id',
        as: 'restaurant',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Plat, {
        foreignKey: 'id',
        sourceKey: 'type_id',
        as: 'plat',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }
  Categorie.init({
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
    },
    isActive: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    tableName: 'categorie',
    modelName: 'Categorie',
  });
  return Categorie;
};
