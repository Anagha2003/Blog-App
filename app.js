require('dotenv').config()
const path=require('path')
const express=require('express')
const cookieParser=require('cookie-parser')
const userRoutes=require('./routes/user')
const blogRoutes=require('./routes/blog')
const Blog=require('./models/blog')
const mongoose=require('mongoose')
const { checkForAuthenticationCookie } = require('./middlewares/authenticate')

const app=express()

mongoose.connect(process.env.MONGO_URL).then(e=>{
  console.log('connected to database')
})

// mongoose.connect('mongodb://localhost:27017/blogDB').then(e=>{
//   console.log('connected to database')
// })

app.set('view engine','ejs');
app.set('views',path.resolve('./views'))

app.use(express.static(path.resolve('./public')));

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.get('/',async (req,res)=>{
const allBlogs=await Blog.find({});

  // console.log("User in Home Route:", req.user);

  res.render('./home',{
    user:req.user,
    blogs:allBlogs,
  })
})

app.use('/user',userRoutes)

app.use('/blog',blogRoutes)



app.listen(process.env.PORT||5200)