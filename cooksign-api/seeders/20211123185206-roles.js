const names = ['Admin', 'User', 'Borne'];

module.exports = {
  /**
   * Create default roles to start in seeders
   * @param queryInterface
   * @returns {Promise<Object | number>}
   */
  up: async (queryInterface) => queryInterface.bulkInsert('roles',
    await Promise.all(names.map(async (name, i) => ({
      id: i + 1,
      role: name,
    }))), {
      updateOnDuplicate: ['id', 'role'],
      ignoreDuplicates: true,
    }),
  /**
   * Cancel the addition of the data above
   * @param queryInterface
   * @returns {Promise<Object>}
   */
  down: (queryInterface) => queryInterface.bulkDelete('role', null, {}),
};
