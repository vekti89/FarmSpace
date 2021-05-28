if(process.env.NODE_ENV !== "production"){
    require("dotenv").config(); 
}
const express = require("express"); 
const app = express(); 
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); 
const engine = require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const MongoDBStore = require('connect-mongo')(session);
const mongoSanitize=require("express-mongo-sanitize");
const helmet = require("helmet");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/farmSpace"; 
//const dbUrl = "mongodb://localhost:27017/farmSpace"; 
mongoose.connect(dbUrl, {
    useNewUrlParser: true, 
    useCreateIndex:true,
    useUnifiedTopology: true, 
    useFindAndModify:false,
})
.then(()=>{
    console.log("MONGO CONNECTION OPEN!")
})
.catch((err)=>{
    console.log("MONGO CONNECTION ERROR: ", err)
}) 

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy:false}));

const secret = process.env.SECRET || "badsecret";

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24*60*60,
})

store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
    store: store, 
    name:"session",
    secret,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
        //secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}; 

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    if(!["/login", "/"].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl; 
    }
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.session = req.session; 
    res.locals.currentUser = req.user; 
    next(); 
});

//ROUTES
const farmRoutes = require("./routes/farms.js"); 
const productRoutes = require("./routes/products.js");
const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews.js");
const basketRoutes = require("./routes/basket");
const categoriesRoutes = require("./routes/categories");
app.use("/farms", farmRoutes); 
app.use("/farms/:id/products", productRoutes); 
app.use("/", userRoutes); 
app.use("/farms/:id/reviews", reviewRoutes); 
app.use("/", basketRoutes); 
app.use("/", categoriesRoutes); 


//landing page
app.get("/", (req, res)=>{
    res.render("landingPage")
})

app.all("*", (req, res, next)=>{
    next(new ExpressError("Page not found", 404))
})  

app.use((err, req, res, next)=>{
    const {statusCode = 500} = err; 
    if(!err.message) err.message="Dear user, sorry, something went wrong!"
    res.status(statusCode).render("error", {err}); 
}); 

process.on('uncaughtException', (err)=>{
    console.log("oh not again..", err)
});

app.listen(8080, (req, res)=> {
    console.log("SERVING ON PORT 8080.")
})  


