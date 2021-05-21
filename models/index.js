const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    protocol: 'postgres',
    operatorsAliases: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        }
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

postgres://ddtoccoxortefq:db3399feb6fc0ce3ac7d98b41597f2ce75d280cb78d7acf7e34dff47b2f15750@ec2-52-19-170-215.eu-west-1.compute.amazonaws.com:5432/d6ef3pctn0uju1
// var sequelize = new Sequelize('postgres://ddtoccoxortefq:db3399feb6fc0ce3ac7d98b41597f2ce75d280cb78d7acf7e34dff47b2f15750@ec2-52-19-170-215.eu-west-1.compute.amazonaws.com:5432/d6ef3pctn0uju1');


sequelize.authenticate().then(() => {
    console.log("Success!");
  }).catch((err) => {
    console.log(err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.advertisings = require("./advertisings.model")(sequelize, Sequelize);
db.posts = require("./posts.model")(sequelize, Sequelize);
module.exports = db;