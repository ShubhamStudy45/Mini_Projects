const express = require('express')
const db = require('../db')
const utils = require('../utils')
const route = express.Router()

route.get('/get-item',(request, response)=>{
    const statement = `
    select 
        c.id, cp.id as copy_id, b.name,b.price, c.quantity 
    from 
        cart c inner join book b 
    on 
        c.book = b.id inner join copies cp 
    on 
        c.copy_id = cp.id 
    where 
        user = ${request.userId}`
    db.execute(statement,(error, data)=>{
        response.send(utils.createResult(error,data))
    })
})
route.post('/add-item',(request, response)=>{
    const { book, copy_id, quantity } = request.body
    const statement = `insert into cart (book, user, copy_id, quantity)
                        values (${book}, ${request.userId}, ${copy_id}, ${quantity})`
    db.execute(statement,(error,data)=>{
      response.send(utils.createResult(error, data))  
    })
})

route.patch('/update-quantity/:id',(request,response)=>{
    const { id } = request.params
    const { quantity } = request.body
    
    const statement = `update cart set quantity = ${quantity} where id = ${id}`

    db.execute(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})

route.delete('/delete-item/:id',(request, response)=>{
    const { id } = request.params
    const statement = `delete from cart where id = ${id}`
    db.execute(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})
module.exports = route