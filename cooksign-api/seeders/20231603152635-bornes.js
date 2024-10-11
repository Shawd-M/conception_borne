const bcrypt = require('bcrypt');

const bornes = [
  {
    restaurant_id: 1,
    code: 'RestaurantBorne1#',
    name: 'RestaurantBorne1#',
    image_id: 3,
    status: 1,
    nextMaintenance:new Date(),
    previousMaintenance: new Date(),
    serieNum: 1111111111,
  },
];

module.exports = {
  /**
   * Create default users to start in seeders
   * @param queryInterface
   * @returns {Promise<Object | number>}
   */
  up: async (queryInterface) => queryInterface.bulkInsert('borne',
    await Promise.all(bornes.map(async (borne, i) => ({
      id: i + 1,
      restaurant_id: borne.restaurant_id,
      code: borne.code,
      name: borne.name,
      image_id: borne.image_id,
      status: borne.status,
      nextMaintenance: borne.nextMaintenance,
      previousMaintenance:  borne.previousMaintenance,
      serieNum: borne.serieNum,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))),
    {
      updateOnDuplicate: ['id', 'restaurant_id', 'code', 'name', 'image_id', 'status', 'nextMaintenance', 'previousMaintenance', 'serieNum'],
    }),
  /**
   * Cancel the addition of the data above
   * @param queryInterface
   * @returns {Promise<Object>}
   */
  down: async (queryInterface) => queryInterface.bulkDelete('borne', null, {}),
};
