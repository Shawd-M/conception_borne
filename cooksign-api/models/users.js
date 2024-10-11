const bcrypt = require('bcrypt');
const {
  Model, Joi, errorMessages, ValidateBeforeCreate,
} = require('../helpers/validate');

const schema = Joi.object({
  id: Joi.number()
    .integer()
    .min(1)
    .messages(errorMessages('id', 'number')),
  firstName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages(errorMessages('Firtname')),
  lastName: Joi.string()
    .min(2)
    .max(100)
    .messages(errorMessages('Lastname')),
  email: Joi.string()
    .min(5)
    .max(100)
    .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    .messages(errorMessages('Email')),
  login: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages(errorMessages('login')),
  // password: Joi.string()
  //   .min(7)
  //   .max(100)
  //   .regex(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{7,100}$/)
  //   .required()
  //   .messages(errorMessages(
  //     'mot de passe',
  //     'string',
  //     '1 majuscule,  1 minuscule, 1 chiffre et 1 cararctère spéciale (! @ # $ % ^ & *)',
  //   )),
}).unknown(true);

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Role, {
        through: 'UserHasRole',
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'roles',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      this.hasOne(models.Restaurant, {
        foreignKey: 'id',
        sourceKey: 'restaurant_id',
        as: 'restaurant',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  User.init({
    // id: {
    //   primaryKey: true,
    //   unique: true,
    //   allowNull: false,
    //   autoIncrement: true,
    //   type: DataTypes.INTEGER,
    // },
    firstName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    lastName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    login: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    address: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    restaurant_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });

  User.beforeCreate(async (user) => {
    await ValidateBeforeCreate(schema, user);
    user.password = await bcrypt.hash(user.password, 10);
  });

  
  User.beforeUpdate(async (user) => {
    await schema.validateAsync(user);
  });

  return User;
};
