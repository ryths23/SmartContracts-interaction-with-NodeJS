const router=require('express').Router();
const {check, validationResult}=require('express-validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {users}=require('../database')
require('dotenv').config()

router.post(
    '/signup',
    [
        check('email','Invalid Email').isEmail(),
        check('password','Password must be atleast 6 character long').isLength({min:6})
    ],
    async(req,res)=>{
        const {email,password}=req.body
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            });
        }
        let user=users.find((user)=>{
            return user.email==email
        })
        if(user){
            return res.status(200).json({
                error:[
                    {
                        email:user.email,
                        msg:'User already exists'
                    }
                ]
            })
        }
        const salt=await bcrypt.genSalt(10)
        console.log('Salt: ',salt)
        const hashedPassword=await bcrypt.hash(password,salt)
        console.log('HashedPassword ',hashedPassword)

        users.push({
            email,
            password:hashedPassword
        })
        const accessToken= await jwt.sign({email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'400s'})
        res.json({accessToken:accessToken})
    }
)

router.get('/users', (req, res) => {
    res.json(users)
})
router.post('/login',async(req,res)=>{
    const {email,password}=req.body
    let user=users.find((user)=>{
        return user.email==email
    })
    if(!user){
        return res.status(400).json({
            errors:[
                {
                    msg: "Invalid credentials"
                }
            ]
        })
    }
    let isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(401).json({
          errors: [
            {
              msg: "Email or password is invalid"
            }
          ]
        })
    }
    const accessToken= await jwt.sign({email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'400s'})
    res.json({accessToken:accessToken})

})
console.log('Welcome to auth')
module.exports=router