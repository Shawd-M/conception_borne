module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('restaurant', {
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
        address: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        employee: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        folder: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        detail_id: {
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
      await queryInterface.dropTable('restaurant');
    },
  };
  
  