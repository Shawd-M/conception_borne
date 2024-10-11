module.exports = {
  /**
   * Default association roles_has_user to start in seeders
   * @param queryInterface
   * @returns {Promise<Object | number>}
   */
  up: async (queryInterface) => queryInterface.bulkInsert('restaurant', [
    {
      name: 'Development',
      address: 'Development',
      employee: 1,
      folder: '1r4sbiEw4FRDewwjsdxO5uhQncZmwO7iy',
      detail_id: 1,
    },
  ], {
    updateOnDuplicate: ['id', 'name', 'address', 'employee', 'folder', 'detail_id'],
    ignoreDuplicates: true,
  }),
  /**
   * Cancel the addition of the data above
   * @param queryInterface
   * @returns {Promise<Object>}
   */
  down: (queryInterface) => queryInterface.bulkDelete('restaurant', null, {}),
};
