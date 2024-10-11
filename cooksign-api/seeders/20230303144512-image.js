const bcrypt = require('bcrypt');

const images = [
  {
    plat_id: null,
    menu_id: null,
    name: 'notFound',
    image_id: '1-ZndwGIdNZvq2cQ9Fd_tiAAWQVLCvH_x',
    url: 'https://drive.google.com/uc?id=1-ZndwGIdNZvq2cQ9Fd_tiAAWQVLCvH_x&export=download',
  },
  {
    plat_id: null,
    menu_id: null,
    name: 'defaultBgBorne',
    image_id: '16dJbxhlXEqK9F4CUS0dMDcrFnQFCP_nF',
    url: 'https://drive.google.com/uc?id=16dJbxhlXEqK9F4CUS0dMDcrFnQFCP_nF&export=download',
  },
  {
    plat_id: null,
    menu_id: null,
    name: 'defaultBorne',
    image_id: '12nTkVwgRbbSx68oBYy0txPddTRke0xzJ',
    url: 'https://drive.google.com/uc?id=12nTkVwgRbbSx68oBYy0txPddTRke0xzJ&export=download',
  },
];

module.exports = {
  /**
   * Create default users to start in seeders
   * @param queryInterface
   * @returns {Promise<Object | number>}
   */
  up: async (queryInterface) => queryInterface.bulkInsert('image',
    await Promise.all(images.map(async (image, i) => ({
      id: i + 1,
      ...image,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))),
    {
      updateOnDuplicate: ['id', 'plat_id', 'menu_id', 'name', 'image_id', 'url'],
    }),
  /**
   * Cancel the addition of the data above
   * @param queryInterface
   * @returns {Promise<Object>}
   */
  down: async (queryInterface) => queryInterface.bulkDelete('image', null, {}),
};
