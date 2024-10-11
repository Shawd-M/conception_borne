const restaurant_details = [
  {
    restaurant_id: 1,
    image_id: 2,
  },
];

module.exports = {
  /**
   * Create default users to start in seeders
   * @param queryInterface
   * @returns {Promise<Object | number>}
   */
  up: async (queryInterface) => queryInterface.bulkInsert('restaurant_details',
    await Promise.all(restaurant_details.map(async (restaurant_detail, i) => ({
      id: i + 1,
      ...restaurant_detail,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))),
    {
      updateOnDuplicate: ['id', 'restaurant_id'],
    }),
  /**
   * Cancel the addition of the data above
   * @param queryInterface
   * @returns {Promise<Object>}
   */
  down: async (queryInterface) => queryInterface.bulkDelete('restaurant_details', null, {}),
};
