const db = require("../models");
const Posts = db.posts;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { whereBuilder } = require("../utils/queryHelper");
const { upload } = require("../utils/cloudinary");
const utils = require("../utils/utils");

// Create and Save a new Post
exports.create = function (req, res) {
  // const {job} = req.body;

  sequelize.query("SELECT nextval('posts_id_seq')").then((nextvalId) => {
    console.log("escuchame");
    const newId = nextvalId[0][0].nextval;

    const { job } = req.body;
    const { photos } = req.body.jobs;

    newPost = Posts.build({
      id: newId,
      post_type: job.post_type || null,
      price: job.price || null,
      category: job.category || null,
      description: job.description || null,
      location: job.location || null,
      duration: job.duration || null,
      email: job.email || null,
      phone: job.phone || null,
      additional: job.additional || null,
    });

    newPost
      .save()
      .then((newReg, newRegError) => {
        if (!newRegError) {
          console.log("resultado");
          console.log(newReg);

          //Imagenes

          let requests = photos.map((photo) => upload(photo));

          Promise.all(requests)
            .then((body) => {
              //this gets called when all the promises have resolved/rejected.
              let results = [];
              body.forEach((res, index) => {
                console.log(orders[index]);
                const vromoPrice = Vromo.getVromoPrice(
                  orders[index].seller.lat,
                  orders[index].seller.lon,
                  orders[index].customerData.lat,
                  orders[index].customerData.lon
                );
                if (res)
                  results.push({
                    ...orders[index]._doc,
                    stuartPrice: res.body.amount,
                    vromoPrice,
                  });
                else results.push({ ...orders[index]._doc, vromoPrice });
                // productsToReturn.push(JSON.parse(res).productInfo)
              });

              if (results.length == 0) {
                return res.status(200).send({
                  orders: orders,
                  message: "Push creado con exito",
                });
              } else {
                return res.status(200).send({
                  orders: results,
                  message: "Push creado con exito",
                });
              }
            })
            .catch((err) => console.log(err));

          photos.forEach((photo) => {
            upload(req.body.photos[0]).then((result, error) => {
              console.log(result);
              return res.status(200).send({
                result: "OK",
                code: 200,
              });
            });
          });

          return res.status(200).send({
            result: "OK",
            code: 200,
          });
        }
        console.log("here?");
      })
      .catch((error) => {
        console.log("shit");
        console.log(error);
      });
  });

  // newPost.save()
  // .then(()=>{
  //   console.log('here?')
  // })
  // .catch((error)=>{
  //   console.log('shit')
  //   console.log(error)
  // })

  // upload(req.body.photos[0])
  // .then((result, error)=>{
  //   console.log(result)
  //   return res.status(200).send({
  //     result: "OK",
  //     code: 200
  //   });
  // })
};

// Retrieve all Posts from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
  console.log(whereBuilder(req.query));
  // Post.findAll({ where: condition })
  Posts.findAll({
    where: whereBuilder(req.query),
    limit: 10,
  })
    // Posts.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Posts.",
      });
    });
};

// Find a single Post with an id
exports.findOne = (req, res) => {
  Posts.update(
    { visits: sequelize.literal("visits + 1") },
    { returning: true, where: { id: req.params.id } }
  )
    .then(([foundPost, [posts]]) => {
      console.log(posts);
      res.status(200).send({
        post: posts,
      });
    })
    .catch((err) => {
      res.status(500).send({
        err: err,
      });
    });
};

// Update a Post by the id in the request
exports.update = (req, res) => {
  // Convert array of photos and services into a string that can be stored
  // stringify didn't work

  req.body.post.photos = req.body.post.photos
    ? utils.formatStringToStore(req.body.post.photos)
    : "{}";
  req.body.post.services = req.body.post.services
    ? utils.formatStringToStore(req.body.post.services)
    : "{}";
  Posts.update(req.body.post, {
    returning: true,
    where: { id: req.body.post.id },
  })
    .then(([foundPost, [posts]]) => {
      console.log(posts);
      res.status(201).send({
        post: posts,
      });
    })
    .catch((err) => {
      res.status(500).send({
        err: err,
      });
    });
};

// Delete a Post with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {};

// Find all published Posts
exports.findAllPublished = (req, res) => {};
