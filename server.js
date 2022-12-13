const express=require('express')
const app=express()

app.use(express.json())
app.use('/auth',require('./routes/auth'))
app.use('/posts',require('./routes/posts'))

app.listen(8080,()=>{
    console.log('App is listening at 8080')
})

