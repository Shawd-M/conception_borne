module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('image', {
      id: {
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      plat_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      menu_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('image');
  },
};
