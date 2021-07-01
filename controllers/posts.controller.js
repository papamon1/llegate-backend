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
      const newContact = utils.dirtyContactField(job.contact);

      newPost = Posts.build({
        id: newId,
        post_type: job.post_type || null,
        price: job.price || null,
        category: job.category || null,
        description: job.description || null,
        location: job.location || null,
        contact: job.contact ? utils.dirtyContactField(job.contact) : null,
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
    } else {
      photos = property.photos;
      const { services } = property;

      newPost = Posts.build({
        id: newId,
        post_type: property.post_type || null,
        price: property.price || null,
        category: property.category || null,
        description: property.description || null,
        location: property.location || null,
        contact: property.contact
          ? utils.dirtyContactField(property.contact)
          : null,
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

          return job
            ? res.status(200).send({
                job: newReg,
                result: "OK",
                code: 200,
              })
            : res.status(200).send({
                property: newReg,
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
  const { size = 10, page = 1 } = req.query;
  // var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
  Posts.findAll({
    where: whereBuilder(req.query, "property"),
    limit: Number(size),
    offset: page > 1 ? Number(page - 1) * Number(size) : 0,
    order: [["updated_at", "desc"]],
  })
    // Posts.findAll()
    .then((dataProperties) => {
      const newDataProperties = [];
      dataProperties.forEach((item) => {
        if (item.contact) {
          item.contact = utils.sanitizeContactField(item.contact);
        }
        newDataProperties.push(item);
      });
      Posts.findAll({
        where: whereBuilder(req.query, "job"),
        limit: Number(size),
        offset: page > 1 ? Number(page - 1) * Number(size) : 0,
        order: [["updated_at", "desc"]],
      }).then((dataJobs) => {
        const newDataJobs = [];
        dataJobs.forEach((item) => {
          if (item.contact) {
            item.contact = utils.sanitizeContactField(item.contact);
          }
          newDataJobs.push(item);
        });
        res.status(201).send({
          top_posts: {
            jobs: newDataJobs,
            properties: newDataProperties,
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

// Retrieve top Posts from the database.
exports.findTop = (req, res) => {
  const { size = 10, page = 1 } = req.query;
  //Top properties
  Posts.findAll({
    where: whereBuilder(req.query, "property"),
    limit: Number(size),
    offset: page > 1 ? Number(page - 1) * Number(size) : 0,
    order: [["visits", "desc"]],
  })
    // Top jobs
    .then((dataProperties) => {
      const newDataProperties = [];
      dataProperties.forEach((item) => {
        if (item.contact) {
          item.contact = utils.sanitizeContactField(item.contact);
        }
        newDataProperties.push(item);
      });
      Posts.findAll({
        where: whereBuilder(req.query, "job"),
        limit: Number(size),
        offset: page > 1 ? Number(page - 1) * Number(size) : 0,
        order: [["visits", "desc"]],
      }).then((dataJobs) => {
        const newDataJobs = [];
        dataJobs.forEach((item) => {
          if (item.contact) {
            item.contact = utils.sanitizeContactField(item.contact);
          }
          newDataJobs.push(item);
        });
        res.status(201).send({
          top_posts: {
            jobs: newDataJobs,
            properties: newDataProperties,
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
  const { size = 10, page = 1 } = req.query;
  Posts.findAll({
    where: whereBuilder(req.query),
    limit: size,
    offset: page > 1 ? Number(page - 1) * Number(size) : 0,
    order: [["updated_at", "desc"]],
  })
    .then((posts) => {
      const newPosts = [];
      posts.forEach((item) => {
        if (item.contact) {
          item.contact = utils.sanitizeContactField(item.contact);
        }

        newPosts.push(item);
      });
      res.status(201).send({
        latest: newPosts,
        result: "OK",
        code: 200,
      });
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
      if (posts.contact)
        posts.contact = utils.sanitizeContactField(posts.contact);
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

// Find all published properties
exports.findProperties = (req, res) => {
  //Top properties
  const { size = 10, page = 1 } = req.query;
  Posts.findAll({
    where: whereBuilder(req.query, "property"),
    limit: Number(size),
    offset: page > 1 ? Number(page - 1) * Number(size) : 0,
    order: [["visits", "desc"]],
  })
    // Latest properties
    .then((tops) => {
      Posts.findAll({
        where: whereBuilder(req.query, "property"),
        limit: Number(size),
        offset: page > 1 ? Number(page - 1) * Number(size) : 0,
        order: [["updated_at", "desc"]],
      }).then((latest) => {
        res.status(201).send({
          top_posts: {
            properties: tops,
          },
          latest,
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

// Find all published jobs
exports.findJobs = (req, res) => {
  const { size = 10, page = 1 } = req.query;
  //Top properties
  Posts.findAll({
    where: whereBuilder(req.query, "job"),
    limit: Number(size) || 0,
    offset: page > 1 ? Number(page - 1) * Number(size) : 0,
    order: [["visits", "desc"]],
  })
    // Latest properties
    .then((tops) => {
      Posts.findAll({
        where: whereBuilder(req.query, "job"),
        limit: Number(size),
        offset: page > 1 ? Number(page - 1) * Number(size) : 0,
        order: [["updated_at", "desc"]],
      }).then((latest) => {
        res.status(201).send({
          top_posts: {
            jobs: tops,
          },
          latest,
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
