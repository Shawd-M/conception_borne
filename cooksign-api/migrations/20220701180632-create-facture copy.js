module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('factures', {
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
      order: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      totalPrice: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      active: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }, {
      timestamps: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('factures');
  },
};
