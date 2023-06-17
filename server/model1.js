let mongoose = require("mongoose")

const ImageSchema = mongoose.Schema({

    uname : {
        type : String,
        require:true        
    },
    desc : {
        type : String,
        require:true 
        
    },
    img : {
        type:Array, 
        require:true 
    },
    date : {
        type : Date,
        default : Date.now
        
    }
})
module.exports = mongoose.model("ImageSchema", ImageSchema)