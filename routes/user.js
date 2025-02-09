const {Router}=require('express');
const User=require('../models/user');
const router=Router();

router.get('/signin',(req,res)=>{
 return res.render('signin')
})

router.get('/signup',(req,res)=>{
  return res.render('signup')
 })

 router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerate(email, password);
    res.cookie('token', token, { httpOnly: true }); // Set token in cookie
    // console.log("Token Set in Cookie:", token);
    return res.redirect('/');
  } catch (error) {
    console.error("Signin Error:", error.message);
    return res.render('signin', { error: error.message });
  }
});

router.get('/logout',(req, res)=>{
res.clearCookie('token').redirect('/')  
})

 router.post('/signup',async(req,res)=>{
  const{fullName,email,password}=req.body
  await User.create({
    fullName ,
    email,
    password,
    
  });
  return res.redirect('/user/signin')
})


module.exports =router;