let mongoose = require("mongoose")
let bcrypt = require("bcrypt")

let userData = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
       
    },
    password : {
        type : String,
        required : true,
    },
    conPassword : {
        type : String,
        required : true,        
    },
    phNumber : {
        type : String,
        required : true,
 
    }

})

userData.pre("save", async function (next){
    try{
        const salt = await bcrypt.genSalt(10)
        const salt1 = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(this.password, salt)
        const hashPassword1 = await bcrypt.hash(this.conPassword, salt1)
        this.password = hashPassword
        this.conPassword = hashPassword1
        next()
    }
    catch(err){
        next(err)
    }
})

module.exports = mongoose.model("testuserregister", userData)