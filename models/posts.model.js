module.exports = (sequelize, Sequelize) => {
    const Posts = sequelize.define("posts", {
        id: { 
            type: Sequelize.BIGINT, 
            primaryKey: true
        },
        user_id: { 
            type: Sequelize.BIGINT,             
        },
        visits: { 
            type: Sequelize.INTEGER,             
        },
        post_type: { 
            type: Sequelize.STRING,             
        },
        price: { 
            type: Sequelize.STRING,             
        },
        category: { 
            type: Sequelize.STRING,             
        },
        description: { 
            type: Sequelize.STRING,             
        },
        location: { 
            type: Sequelize.STRING,             
        },
        photos: { 
            type: Sequelize.STRING,             
        },
        status: { 
            type: Sequelize.STRING,             
        },
        contact: { 
            type: Sequelize.STRING,             
        },
        duration: { 
            type: Sequelize.STRING,             
        },
        size: { 
            type: Sequelize.INTEGER, 
        },
        bathrooms: { 
            type: Sequelize.STRING,             
        },
        rooms: { 
            type: Sequelize.STRING,             
        },
        services: { 
            type: Sequelize.STRING,             
        },
        created_at: { 
            type: Sequelize.DATE,             
        },
        updated_at: { 
            type: Sequelize.DATE,             
        },
    },
    {
      timestamps: false
    }
    );
  
    return Posts;
  };