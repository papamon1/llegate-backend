module.exports = (sequelize, Sequelize) => {
  const PostsServices = sequelize.define(
    "posts_services",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      description: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return PostsServices;
};
