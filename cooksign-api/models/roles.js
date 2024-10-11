const {
    Model,
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
      static associate(models) {
        this.belongsToMany(models.User, {
          through: 'UserHasRole',
          foreignKey: {
            name: 'roleId',
            allowNull: false,
          },
          as: 'users',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
      }
    }
    Role.init({
      role: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      tableName: 'roles',
      modelName: 'Role',
    });
    return Role;
  };
  