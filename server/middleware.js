let jwt = require("jsonwebtoken")

module.exports = (req,res,next)=>{
    try{
        let token = req.headers("x-token");
        if(!token){
            return res.send({status:400, message : "token not found"})
        }
        let decoded = jwt.verify(token,"unlockKey")
        req.user = decoded.user
        next()
    }
    catch(err){
        console.log(err)
    }
}