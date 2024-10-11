module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('plat_has_ingredient', {
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
      ingredient_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      // quantity: {
      //   allowNull: true,
      //   type: Sequelize.FLOAT,
      // },
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
    await queryInterface.dropTable('plat_has_ingredient');
  },
};
