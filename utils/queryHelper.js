const db = require("../models");
const Op = db.Sequelize.Op;

exports.whereBuilder = (params, post_type = null) => {
  const propertyNames = Object.keys(params);
  const conditions = {};

  propertyNames.forEach((prop) => {
    //Componemos las condiciones y nos saltamos los parámetros de tamaño y pagina
    if (prop !== "page" && prop !== "size")
      conditions[prop] = { [Op.iLike]: `%${params[prop]}%` };
  });

  if (post_type) conditions["post_type"] = { [Op.eq]: `${post_type}` };

  return conditions;
};
