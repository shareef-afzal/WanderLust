if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const atlas_DB_URL=process.env.ATLAS_URL;
async function main() {
  try {
    await mongoose.connect(process.env.ATLAS_URL, {
  serverSelectionTimeoutMS: 15000,
  family: 4  // force IPv4
});
    console.log("Connected to Atlas DB");
  } catch (err) {
    console.error("Error connecting to Atlas:", err);
    throw err;
  }
}

main();
const store=MongoStore.create({
    mongoUrl:atlas_DB_URL,
    mongoOptions: {
        family: 4,                // force IPv4
        serverSelectionTimeoutMS: 15000
        // You can also add tlsAllowInvalidCertificates: true for debugging if needed
    },
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
})
 store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
  });


const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:new Date(Date.now()+7*24*60*60*1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.get("/",(req,res)=>{
//     res.send("hi iam root");
// })

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/demouser",async (req,res)=>{
    let fakeUser={
        email:"user@gmail.com",
        username:"afzal"
    }
    let registeredUser=await User.register(fakeUser,"mypassword");
    res.send(registeredUser);
})

//User Router
app.use("/",userRouter);
//Listings Router
app.use("/listings",listingRouter);
// Reviews Router
app.use("/listings/:id/reviews",reviewRouter);

// catch-all for any unhandled route (404)
app.use((req, res, next) => {
  next(new ExpressError( 404,'Page Not Found'));
});

//CUSTOM ERROR HANLDER 
app.use((err,req,res,next)=>{
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode);
    res.render("error.ejs",{message});
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
