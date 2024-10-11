module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('menu', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // plat_id: Sequelize.INTEGER,
      restaurant_id: Sequelize.INTEGER,
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      image_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      active: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1,
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
    await queryInterface.dropTable('menu');
  },
};
