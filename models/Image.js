const mongoose = require("mongoose");
const { Schema} = mongoose;
const imgSchema = new Schema({
    image:{
        type: Schema.Types.Buffer
    }, 
    contentType: {
        type: Schema.Types.String
    }
});
const Image = mongoose.model("Image",imgSchema); 
module.exports = Image;