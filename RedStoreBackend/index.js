import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {config} from "dotenv";
config();
import bcrypt from "bcrypt";
import cors from "cors";
import User from "./models/User.js";
import ContactDetail from "./models/Contact.js";
const saltRound = 13;

const app  = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000/', // Allow requests only from this origin (replace with your frontend's URL)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

mongoose.connect(process.env.MONGOURL+"retryWrites=true&w=majority");



// route that always return true value used for checking using ddeployment
app.get("/",(req,res)=>{
    res.send("Working");
});

//Register route handling

app.post("/register",async (req,res)=>{
    const username = req.body.email;
    const password = req.body.password;
    const user = await User.find({email:username});
    if(user.length){
        res.status(409).send("User already exist");
    }
    else{
        
        bcrypt.hash(password, saltRound, async function(err, hash) {
            if(err){
                res.status(410).send("Something went worng");
            }
            else{
                const newUser = await User.create({
                    email : username,
                    password:hash
                });
            }
        });

        res.status(200).send("Registered Successfully!");
    }
});

// login route

app.post("/login", async (req,res)=>{
    const username = req.body.email;
    const password =req.body.password;
    const user = await User.find({email:username});
    if(!user.length){
        res.status(403).send("Invalid username or password");
    }
    else{
        const hash = user[0].password;
        bcrypt.compare(password, hash, function(err, result) {
            // result == true
            if(err){
                res.status(403).send("Something went wrong");
            }
            if(result){
                res.status(200).send("Successfully Logged In");
            }
        });
    }
});
// contact us
app.post("/contact-us",async(req,res)=>{
    const email = req.body.email;
    const phone = req.body.phone;
    const name = req.body.name;
    const message = req.body.message;
    const detail = new ContactDetail({
        name,email,phone,message
    });
    await detail.save();
    res.send("Message has sent successfully!");
});
// get all users
app.get("/users/all", async(req,res)=>{
    const users = await User.find({}).select("username");
    res.status(200).send(users);
});
//get contact detils
app.get("/contact/all",async(req,res)=>{
    const details = await ContactDetail.find({}).sort({messageDate:-1});
    res.status(200).send(details);
});
app.listen(3000,()=>{console.log("Server is running at port 3000")});
