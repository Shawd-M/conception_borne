module.exports = {
  /**
   * Default association roles_has_user to start in seeders
   * @param queryInterface
   * @returns {Promise<Object | number>}
   */
  up: async (queryInterface) => queryInterface.bulkInsert('user_has_role', [
    {
      id: 1,
      userId: 1,
      roleId: 1,
    },
    {
      id: 2,
      userId: 2,
      roleId: 3,
    },
  ], {
    updateOnDuplicate: ['id', 'userId', 'roleId'],
    ignoreDuplicates: true,
  }),
  /**
   * Cancel the addition of the data above
   * @param queryInterface
   * @returns {Promise<Object>}
   */
  down: (queryInterface) => queryInterface.bulkDelete('user_has_role', null, {}),
};
