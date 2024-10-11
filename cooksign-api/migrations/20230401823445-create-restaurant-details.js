module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('restaurant_details', {
      id: {
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      restaurant_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      color: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      colorAdmin: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      colorText: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      image_id: {
        allowNull: true,
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
    await queryInterface.dropTable('restaurant_details');
  },
};
