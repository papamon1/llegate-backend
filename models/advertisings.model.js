module.exports = (sequelize, Sequelize) => {
    const Advertisings = sequelize.define("advertisings", {
      id: { 
        type: Sequelize.BIGINT, 
        primaryKey: true
      },
      site_url: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    },
    {
      timestamps: false
    }
    );
  
    return Advertisings;
  };