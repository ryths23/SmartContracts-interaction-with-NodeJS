require('dotenv').config()
const express=require('express')
const jwt=require('jsonwebtoken')

const app=express()

app.use(express.json())

const posts = [
    {
      username: 'Jim',
      title: 'Post 2'
    },
    {
        username: 'Kyle',
        title: 'Post 1'
    }
]
app.get('/posts', authenticateToken, (req,res)=>{
    res.json(posts.filter(posts=>posts.username==req.user.name))
})

app.post('/login',(req,res)=>{
    const username=req.body.username
    const user = {name:username}
    const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken})
})

function authenticateToken(req,res,next) {
    const authHeader=req.headers['authorization']
    const token= authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
app.listen(8080,()=>{
    console.log("Application is running at port 8080")
})