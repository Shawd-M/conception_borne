const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserHasRole extends Model {
    static associate() {}
  }
  UserHasRole.init({
    roleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'UserHasRole',
    tableName: 'user_has_role',

  });
  return UserHasRole;
};
