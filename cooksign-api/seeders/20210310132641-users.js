const bcrypt = require('bcrypt');

const users = [
  {
    lastName: 'Theodore',
    firstName: 'Theodore',
    login: 'Theodore',
    password: 'Theodore77#',
    restaurant_id: 1,
  },
  {
    lastName: null,
    firstName: 'RestaurantBorne1#',
    login: 1111111111,
    password: 'RestaurantBorne1#',
    restaurant_id: 1,
  },
];

module.exports = {
  /**
   * Create default users to start in seeders
   * @param queryInterface
   * @returns {Promise<Object | number>}
   */
  up: async (queryInterface) => queryInterface.bulkInsert('users',
    await Promise.all(users.map(async (user, i) => ({
      id: i + 1,
      lastName: user.lastName,
      firstName: user.firstName,
      login: user.login,
      password: await bcrypt.hash(user.password, 10),
      restaurant_id: user.restaurant_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))),
    {
      updateOnDuplicate: ['id', 'lastName', 'firstName', 'login', 'password'],
    }),
  /**
   * Cancel the addition of the data above
   * @param queryInterface
   * @returns {Promise<Object>}
   */
  down: async (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
