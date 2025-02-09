const { createHmac,randomBytes } = require('crypto');
const {Schema,model}=require('mongoose')

const userScheme=new Schema({
    fullName:{
      type:String,
      required:true
    },
    email:{
      type:String,
      required:true,
      unique:true
    },
    salt:{
      type:String,
      
    },
    password:{
      type:String,
      required:true
    },
    profileImageUrl:{
      type:String,
      default:'/images/panda.png'
    },
    role:{
      type:String,
      enum:['USER','ADMIN'],
      default:'USER'
    }

},
 {timestamps:true}
)
userScheme.pre('save',function (next){
  const user=this;

  if(!user.isModified("password")) return
const salt=randomBytes(16).toString();
const hashedPassword=createHmac('sha256',salt).update(user.password).digest('hex');

this.salt=salt;
this.password=hashedPassword;

next();

})

userScheme.static('matchPasswordAndGenerate',async function(email,password){
  const user=await this.findOne({email});
  if(!user) throw new Error('No such user');
  const salt=user.salt;
  const hashedPassword=user.password

  const userProvidedHash=createHmac('sha256',salt).update(password).digest("hex")

  if(hashedPassword!==userProvidedHash) throw new Error('Invalid password');


  // return hashedPassword===userProvidedHash;
 const {createTokenForUser}=require('../services/authenticate')
 return createTokenForUser(user);
// const token=createTokenForUser(user);
// return token;
})


const User=model('User',userScheme)

module.exports=User;
