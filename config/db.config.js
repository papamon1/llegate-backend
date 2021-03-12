module.exports = {
    HOST: "ec2-52-19-170-215.eu-west-1.compute.amazonaws.com",
    USER: "ddtoccoxortefq",
    PASSWORD: "db3399feb6fc0ce3ac7d98b41597f2ce75d280cb78d7acf7e34dff47b2f15750",
    DB: "d6ef3pctn0uju1",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };