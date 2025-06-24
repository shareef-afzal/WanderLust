const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({email,username});
        let registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err) => {
        if (err) {
            return next(err);
        }
        req.flash("success","SignUp Successful");        
        res.redirect("/listings");
    });
        
    }
    catch(err){
        let msg=err.message;
        req.flash("error",msg);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login=(req,res)=>{
        req.flash("success","login successful");
        let redirectUrl=res.locals.redirectUrl||"/listings";
        res.redirect(redirectUrl);
}
module.exports.logout=(req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You're already logged out.");
        return res.redirect("/listings");
    }

    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You Are Logged Out!");
        res.redirect("/listings");
    });
}