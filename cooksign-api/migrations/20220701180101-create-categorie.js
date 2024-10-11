module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('categorie', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      icon: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      restaurant_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      isActive: {
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
    await queryInterface.dropTable('categorie');
  },
};
