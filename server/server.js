let express = require("express")
let mongoose = require("mongoose")
let jwt = require("jsonwebtoken")
let cors = require("cors")
let userData = require("./model")
let middleware = require("./middleware")
const multer = require('multer');
let path = require("path")
let ImageSchema = require("./model1")
let bcrypt = require("bcrypt")



let app = express();
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

app.use(express.json())
app.use(cors({origin:"*"}))

mongoose.connect("mongodb+srv://abhi6equj5:abhi6equj5@cluster0.gglaxr9.mongodb.net/?retryWrites=true&w=majority").then(()=>console.log("DB Authentication Success..."))

// app.get("/", (req,res)=>{
//     res.send("Hello node js...")
// })

//routes
app.post("/api/createuser", async(req,res)=>{
    try{
        console.log(req.body)
        let {name, email, password, conPassword, phNumber} = req.body;
        let exist = await userData.findOne({email})
        if(exist){
            return res.send({status : 400, message:"user already exist"})
        }

        let saveuser = new userData({name, email, password, conPassword, phNumber})
        await saveuser.save()

        return res.send({status: 200, message:"user register successfully"})
       // return res.json(await userData.find()) 
 
    }
    catch(err){
        console.log(err) 
    }
})


app.post("/api/loginuser", async(req,res)=>{
    try{
        let {email, password} = req.body;
        let exist = await userData.findOne({email})
        if(!exist){
            return res.send({status:400, message:"user not found..."})
        }
        let hashPassword= exist.password;
        bcrypt.compare(password, hashPassword, (err, result)=>{
            if(err){
                return res.send({status:400, message:"incorrect password"})
            }
            else{
                return res.send({status:200, message:"login successfull..."})

            }
           
        })
        
        let payload = {
            user:{
                id : exist.id
            }
        }
        jwt.sign(payload, "unlockKey",{expiresIn:600},(err,token)=>{
            if(err){
                console.log(err)
            }
            return res.json({token})
        })

    }
    catch(err){
        console.log(err)
    }
})
//protected router
app.get("/home",middleware,async(req,res)=>{
    try{
        let exist = await userData.findById(req.user.id) 
        if(!exist) {
            return res.send({status:400, message:"user not found..."})
        }
        return res.json(exist)
    }
    catch(err){
        console.log(err)
    }
})


app.get("/api/getuser", async(req,res)=>{
    try{
      return  res.json(await userData.find())
    }
    catch(err){
        console.log(err)
    }
})

app.get(`/api/getuser/:id`, async(req,res)=>{
    try{
        return  res.json(await userData.findById(req.params.id)) 
      }
      catch(err){
          console.log(err)
      }
})

//img upload

    //   const upload = multer({ storage: multer.memoryStorage()});

    //   app.post('/fileuplo', upload.single('file'), async(req, res)=> {
    //     const file = req.file;
    //     fs.writeFileSync(__dirname + "/" + file.originalname, file.buffer);

    //     res.status(200).json({status:"ok"})

    //   })
      

    app.use("/Images", express.static("Images"))

    const storage = multer.diskStorage({
        destination: (req, file, cb)=> { 
          cb(null, 'Images'); 
        },
        filename: (req, file, cb)=> {
          cb(null, Date.now() + path.extname(file.originalname)); 
        }
      });
      const upload = multer({ storage: storage });

app.post('/fileupload',upload.array("img"), async(req, res)=> {  
    console.log("body", req.body)
    console.log("file", req.files)
 
        const {uname, desc}= req.body;
        const imageurl = req.files.map(res=>req.protocol + '://' + req.get('host') + '/Images/' + res.filename);
        console.log("names...", imageurl)

        // if(!uname || !desc || !imageurl ){
        //     return res.send({status:400, message:"Field the Fields..."})
        // }

        const image = new ImageSchema({uname:uname, desc:desc,img:imageurl})
        image.save();
        

       res.send({status:200, message:"image uploaded..."})     
    }) 

app.get("/display", async(req,res)=>{
    return res.json(await ImageSchema.find()) 
})

 
    
// app.post('/fileupload',upload, async(req, res)=> {
//     console.log(req.body);
//     res.send("image uploaded...") 
//     upload(req, res, (err)=> { 
//         if(err) {
//             console.log(err) 
//         }  
//         else {
//            //const {file} = req.body; 
//             const image = new ImageSchema({file : {data:req.file.filename, contentType:"image/*"}})
//             image.save();
//             res.send("image uploaded...")   
//         }   
//     })
    
   
//     })
      
app.get("/getimgupload", (req,res)=>{
    res.send("upload")
})

app.listen(9090,()=>console.log("server running...")) 