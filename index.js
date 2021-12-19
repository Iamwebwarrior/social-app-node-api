const express = require("express");
const app = express()


const mongoose = require("mongoose");
const helmet= require("helmet");
const dotenv=require("dotenv");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");

const multer = require("multer");
const path = require("path");


dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useCreateIndex: true,
        //useFindAndModify: true 
    })
    .then(console.log("database connected"))
    .catch((err)=>console.log(err))


const storage = multer.diskStorage({
    destination: (req, file, cb) => {  //cb-->call back function
        cb(null, "images");  //--> destination name is images
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
        //cb(null, "myfile.png");
    },
});


//  http://localhost:4000/api/upload
//POST
//form-data
// KEY-->file  && drop from same field(file)  ==>value is file choose
// {
//     "name": "myimg.jpeg"
// }
const upload = multer({ storage: storage }); //-->first arg storage is from above variable
app.post("/api/upload", upload.single("file"), (req, res) => { //--> file is key here(used in postman)
    res.status(200).json("File has been uploaded");
});
    



//middleware
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(express.json());  //body parser which is used whn request is made
app.use(helmet());
app.use(morgan("common"));


app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.use("/api/categories", categoryRoute);


app.get("/",(req,res)=>{
    res.send("hello there");
})


app.listen(3000,()=>{
    console.log("backend is running");
});


