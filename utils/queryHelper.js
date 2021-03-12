const db = require("../models");
const Op = db.Sequelize.Op;

exports.whereBuilder = (params) =>{
    const propertyNames = Object.keys(params);
    const conditions = {}
    console.log('aqui estamos')

    propertyNames.forEach(prop=>{
        console.log(prop)
        conditions[prop]={ [Op.iLike]: `%${params[prop]}%` }        
    })

    return conditions
}