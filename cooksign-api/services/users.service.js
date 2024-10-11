const bcrypt = require('bcrypt');
const { required } = require('joi');
const { Op } = require('sequelize');
const { User, Role, UserHasRole, Restaurant, Restaurant_detail } = require('../models');

module.exports = {
  /**
   * Verifie si le mot de passe fournit correspond avec le hash de la bdd
   * @param password1
   * @param password2
   * @returns {Promise<*>}
   * @constructor
   */
   Compare: async (password1, password2) => {
    const isMatch = await bcrypt.compare(password1, password2);
    return isMatch;
  },
  /**
   * Verifie si un utilisateur existe sinon il le cree
   * @param data
   * @returns {Promise<(Model<any, TModelAttributes>|boolean)[]>}
   * @constructor
   */
  FindOrCreate: async (data) => {
    const [user, created] = await User.findOrCreate({
      where: {
        login: data.login,
      },
      raw: true,
      defaults: data,
    });
    return [user, created];
  },

   /**
   * Verifie si un user existe à partir de son id ou de son login et le retourne
   * @param data
   * @returns {Promise<Model<any, TModelAttributes>>}
   * @constructor
   */
  FindUser: async (data) => {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { login: data },
          { id: data },
        ],
      },
      include: [
        {
          model: Role,
          as: 'roles',
        },
        {
          model: Restaurant,
          as: 'restaurant',
          include: [
            {
              model: Restaurant_detail,
              as: 'restaurant_detail',
            }
          ]
        }
      ],
    });
    return user;
  },

  AddRole: async (roleId, userId) => {
    const [role, created] = await UserHasRole.findOrCreate({
      where: {
        userId,
        roleId,
      },
      defaults: { roleId, userId },
    });
    return created;
  },

  Update: async (data) => {

    const [isUpdated] = await User.update(data, {
      where: {
        id: data.id,
      },
    });

    return !!isUpdated;
  },

  UpdateBorne: async (data) => {
    const [isUpdated] = await User.update(data, {
      where: {
        firstName: data.firstName,
        login: data.login,
      },
    });

    return !!isUpdated;
  },

  ReadAll: async () => {
    const restaurant = await User.findAll({
      include: [{
        model: Role,
        as: 'roles',
        where: {
          role: {
            [Op.not]: 'Borne',
          },
        },
        required: true,
        attributes: [],
      }],
      attributes: ['id', 'lastName', 'firstName', 'email', 'login', 'address', 'restaurant_id'],
    });
    return restaurant;
  },
};
