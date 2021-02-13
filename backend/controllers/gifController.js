const express = require('express');

const app = express();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const cloudinaryConfig = require('../services/config');
const poolConfig = require('../services/config');

const { cloudIt } = cloudinaryConfig;
const { pool } = poolConfig;

const storageHandle = (req, file, cb) => {
  cb(null, 'controllers/uploads');
};
const fileHandle = (req, file, cb) => {
  console.log(file);
  cb(null, file.originalname);
};
const storage = multer.diskStorage({
  destination: storageHandle,
  filename: fileHandle,
});

const gifPost = (req, res) => {
  const upload = multer({ storage }).single('images');
  upload(req, res, (err) => {
    if (err) {
      return res.send(err);
    }
    //  return res.json(req.file); // file uploaded to server
    console.log('file uploaded to server');
    console.log(req.file);

    // Send file to Cloudinary
    cloudinary.config({
      cloud_name: cloudIt.CLOUD_NAME,
      api_key: cloudIt.API_KEY,
      api_secret: cloudIt.API_SECRET,
    });
    const { path } = req.file;
    const uniqueFilename = new Date().toISOString();

    cloudinary.uploader.upload(
      path,
      { puplic_id: `gifs/${uniqueFilename}`, tags: 'gifs' },
      (error, image) => {
        if (error) return res.send(error);
        console.log('file uploaded to cloudinary');

        // remove file from server
        fs.unlinkSync(path);

        pool.query('INSERT INTO gifs(title, imageUrl) VALUES($1,$2) RETURNING *', [image.original_filename, image.url]);

        if (error) {
          throw error;
        }
        return res.status(201).json(image);

        // return image details
      },
    );
    return console.log('post successful');
  });
};

// DELETE gif

const gifDelete = (async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM gifs WHERE id = $1', [req.params.id]);

    if (result.rowCount < '1') {
      return res.status(400).json({
        message: 'record not found!',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'gif post successfully deleted',
    });
  } catch (error) {
    console.error(error);
  }
  return next();
});

const commentPost = (req, res) => {
  const data = {
    userId: req.body.userId,
    // articleId: req.body.articleId,
    comment: req.body.comment,
    gifId: req.body.gifId,
  };

  pool.connect((err, client, done) => {
    const query = 'INSERT INTO comments(userId, comment, gifId) VALUES($1,$2,$3) RETURNING *';
    const values = [data.userId, data.comment, data.gifId];

    client.query(query, values, (error) => {
      done();
      if (error) {
        throw error;
      }
      res.status(201).json({
        data,
      });
    });
  });
};

module.exports = { gifPost, gifDelete, commentPost };

app.listen(7000);
