const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");



//http://localhost:4000/api/users
//    router.get("/", (req, res) => {
//        res.send("this are posts");
//    })

//REGISTER
//  http://localhost:4000/api/auth/register
//REGISTER
router.post("/register", async (req, res) => {
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

       

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        console.log("Connected11s to MongoDB");
        
        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
       
    } catch (err) {
       // console.log(err);
        res.status(500).json(err)
    }
});

//  http://localhost:3000/api/auth/login
//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password")

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
});



module.exports = router;