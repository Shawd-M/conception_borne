module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('plat_has_menu', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      plat_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      menu_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      PlatHasMenuId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
    }, {
      timestamps: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('plat_has_menu');
  },
};
