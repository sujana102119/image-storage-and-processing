const router = require('express').Router();
const upload = require("../middleware/upload");
const dbConfig = require("../config/db");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const url = dbConfig.url;
const mongoClient = new MongoClient(url);

const uploadImage = async (req, res) => {
    // try {
    await upload(req, res);
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        contentType:req.file.mimetype,
        image:new Buffer(encode_img,'base64')
    };
    image.create(final_img,function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log(result.img.Buffer);
            console.log("Saved To database");
            res.contentType(final_img.contentType);
            res.send(final_img.image);
        }
    })
    //   console.log(req.file);
    //   if (req.file == undefined) {
    //     return res.send({
    //       message: "You must select a file.",
    //     });
    //   }
    //   return res.send({
    //     message: "File has been uploaded.",
    //   });
    // } catch (error) {
    //   console.log(error);
    //   return res.send({
    //     message: `Error when trying upload image: ${error}`,
    //   });
    // }
};

const download = async (req, res) => {
    try {
      await mongoClient.connect();
      const database = mongoClient.db(dbConfig.database);
      const bucket = new GridFSBucket(database, {
        bucketName: dbConfig.imgBucket,
      });
      let downloadStream = bucket.openDownloadStreamByName(req.params.name);
      downloadStream.on("data", function (data) {
        return res.status(200).write(data);
      });
      downloadStream.on("error", function (err) {
        return res.status(404).send({ message: "Cannot download the Image!" });
      });
      downloadStream.on("end", () => {
        return res.end();
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  };

router.get('/', downloadImage);
router.post('/uploadImage', uploadImage);

module.exports = router;