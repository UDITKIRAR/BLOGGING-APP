require("dotenv").config();
const path=require("path");
const mongodb=require("mongodb");
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const Blog=require("./models/blog");
const userRouter=require("./routes/user");
const blogRouter=require("./routes/blog");
const { checkforAuthenticationCookie } = require("./middlewares/auth");
const app=express();
const PORT= process.env.PORT || 8000;


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("MongoDB connected");
})

app.set("view engine","ejs");

app.set("views",path.resolve("./views"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(checkforAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));


app.get("/", async (req,res)=>{
    const allBlogs=await Blog.find({});
    res.render("home",{user:req.user,blogs:allBlogs});
});
app.use("/user",userRouter);
app.use("/blog",blogRouter);

app.listen(PORT,()=>{
    console.log(`server started on port:${PORT}` )
})