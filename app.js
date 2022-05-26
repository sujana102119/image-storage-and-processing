const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
const Image = require('./models/Image');

// const routes = require('./routes');
//const { logger } = require('./lib');
// const { setupSwaggerAPI } = require('./api-docs');
//const path = require('path');
//process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config');

const app = express();
// require('./lib/mongo-db');


// const port = process.env.PORT || 7600;

// app.use(bodyParser.json({
//   limit: '50mb',
// }));

app.use(bodyParser.urlencoded({
  extended: true,
}));


// setupSwaggerAPI(app);

// routes(app);

const errorHandler = (err, req, res, next) => {
  console.log(`Here ${err.stack}`);
  if (res.headersSent) {
    next(err);
    return;
  }
  res.sendStatus(500);
};

app.use(errorHandler);

mongoose.connect("mongodb://localhost/Images");      

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
  var upload = multer({ storage: storage })


app.get("/",(req,res)=>{
    res.send('Service is alive');
})

app.get("/show/:id",(req,res)=>{
    const { id } = req.params;
    const image = Image.findById(id);
    res.send(image);
});

app.post("/upload",upload.single('image'), async (req,res)=>{
    try {
        var img = fs.readFileSync(req.file.path);
        var encode_img = img.toString('base64');
        var final_img = new  Image({
            contentType: req.file.mimetype,
            image: new Buffer(encode_img,'base64')
        });
        const savedImage = await final_img.save();
        res.send(savedImage._id);
    } catch (error) {
        console.log(`Error :: ${error.stack}`);
    }
})

const port = 3000;

app.listen(port, (err) => {
  if (err) {
    console.log(`${err.stack}`);
    return;
  }
  console.log(`Listening on port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.log(`uncaughtException :: ${err.stack}`);
  process.exit(1);
});