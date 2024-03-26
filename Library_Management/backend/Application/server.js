const express = require('express')
const jwt = require('jsonwebtoken')

const bodyParser = require('body-parser')

//application routes
const userRouter = require('./routes/user')
const bookRouter = require('./routes/book')
const cartRouter = require('./routes/cart')
const issueBookRouter = require('./routes/issuebook')

const config = require('./config')

const app = express()

app.use(bodyParser.json())

app.use((request,response, next)=>{

    const token = request.headers['token']

    if(request.url.startsWith('/user/signin') ||
    request.url.startsWith('/user/signup')){
        next()
    }else{
        try{
            // console.log(token)
            const payload = jwt.verify(token,config.secrete)
            request.userId = payload['id']
            // console.log(request.userId)
            
            next() 
        }catch(ex){
           response.send({
            status : 'error',
            error : "Unauthrized access..!!"
           })
        }
    
    }

})
app.use('/user/',userRouter)
app.use('/book',bookRouter)
app.use('/cart',cartRouter)
app.use('/issuebook',issueBookRouter)
app.listen(4000,'0.0.0.0',()=>{
    console.log('server started on port 4000')
})