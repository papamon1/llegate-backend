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
    const newId = nextvalId[0][0].nextval;

    const { job } = req.body;
    const { property } = req.body;
    let newPost = null;
    let photos = null;

    // Componemos el nuevo objeto
    if (job) {
      photos = job.photos;

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
        photos: utils.formatStringToStore(
          photos.map(
            (pic, index) => `posts_photos/post_${newId}/${newId}_${index}.png`
          )
        ),
      });
    }else{
      photos = property.photos;
      const {services} = property;

      newPost = Posts.build({
        id: newId,
        post_type: property.post_type || null,
        price: property.price || null,
        category: property.category || null,
        description: property.description || null,
        location: property.location || null,
        duration: property.duration || null,
        email: property.email || null,
        phone: property.phone || null,
        additional: property.additional || null,
        photos: utils.formatStringToStore(
          photos.map(
            (pic, index) => `posts_photos/post_${newId}/${newId}_${index}.png`
          )
        ),
        services: utils.formatStringToStore(services),
      });
    }

    newPost
      .save()
      .then((newReg, newRegError) => {
        if (!newRegError) {
          //Imagenes

          photos.forEach((photo, index) => {
            const tempFile = utils.encodeFile(
              "data:image/png;base64," + photo,
              newId,
              index
            );
          });

          return res.status(200).send({
            result: "OK",
            code: 200,
          });
        }
      })
      .catch((error) => {
        console.log("shit");
        console.log(error);
      });
  });
};

// Retrieve all Posts from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  const final = {};
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
  Posts.findAll({
    where: whereBuilder(req.query),
    limit: req.query.size,
    offset: Number(req.query.page) * Number(req.query.size),
    order: [["updated_at", "desc"]],
  })
    // Posts.findAll()
    .then((dataTotal) => {
      Posts.findAll({
        where: whereBuilder(req.query),
        limit: req.query.size,
        offset: req.query.page,
        order: [["updated_at", "desc"]],
      }).then(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Posts.",
      });
    });
};

// Retrieve top Posts from the database.
exports.findTop = (req, res) => {
  //Top properties
  Posts.findAll({
    where: whereBuilder(req.query, "property"),
    limit: Number(req.query.size),
    offset: Number(req.query.page) * Number(req.query.size),
    order: [["updated_at", "desc"]],
  })
    // Top jobs
    .then((dataProperties) => {
      Posts.findAll({
        where: whereBuilder(req.query, "job"),
        limit: Number(req.query.size),
        offset:
          Number(req.query.page) === 1
            ? 0
            : Number(req.query.page) * Number(req.query.size),
        order: [["updated_at", "desc"]],
      }).then((dataJobs) => {
        res.status(201).send({
          top_posts: {
            jobs: dataJobs,
            properties: dataProperties,
          },
          result: "OK",
          code: 200,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Posts.",
      });
    });
};

// Retrieve latest Posts from the database.
exports.findLatest = (req, res) => {
  const title = req.query.title;
  const final = {};
  Posts.findAll({
    where: whereBuilder(req.query),
    limit: req.query.size,
    offset: Number(req.query.page) * Number(req.query.size),
    order: [["updated_at", "desc"]],
  })
    // Posts.findAll()
    .then((dataTotal) => {
      Posts.findAll({
        where: whereBuilder(req.query),
        limit: req.query.size,
        offset: req.query.page,
        order: [["updated_at", "desc"]],
      });
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
exports.delete = (req, res) => {
  Posts.destroy({ where: { id: req.params.id } })
    .then((results) => {
      if (results === 0) {
        res.status(404).send({
          message: "Not found",
          code: 404,
        });
      }
      res.status(200).send({
        result: "OK",
        code: 200,
      });
    })
    .catch((err) => {
      res.status(500).send({
        err: err,
      });
    });
};

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {};

// Find all published Posts
exports.findAllPublished = (req, res) => {};

// Find all published Posts
exports.findProperties = (req, res) => {
  console.log(req.query.page);
  //Top properties
  Posts.findAll({
    where: whereBuilder(req.query, "property"),
    limit: Number(req.query.size),
    offset: Number(req.query.page) * Number(req.query.size),
    order: [["updated_at", "desc"]],
  })
    // Top jobs
    .then((dataProperties) => {
      Posts.findAll({
        where: whereBuilder(req.query, "job"),
        limit: Number(req.query.size),
        offset:
          Number(req.query.page) === 1
            ? 0
            : Number(req.query.page) * Number(req.query.size),
        order: [["updated_at", "desc"]],
      }).then((dataJobs) => {
        res.status(201).send({
          top_posts: {
            jobs: dataJobs,
            properties: dataProperties,
          },
          result: "OK",
          code: 200,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Posts.",
      });
    });
};
