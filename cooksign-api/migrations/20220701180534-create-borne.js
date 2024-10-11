module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('borne', {
      id: {
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      restaurant_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      nextMaintenance: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      previousMaintenance: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      serieNum: {
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
    await queryInterface.dropTable('borne');
  },
};
