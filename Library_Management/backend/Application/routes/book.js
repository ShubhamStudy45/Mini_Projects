const express = require('express')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')

const db = require('../db')
const utils = require('../utils')
const route = express.Router()

route.get('/find-book',(request, response)=>{

    const { name } = request.body
    const statement = `select * from book where name like '%${name}%'`
    // console.log(statement)
    db.execute(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})
// add book
route.post('/add-book',(request, response)=>{
    
    const { name, author, subject, price } = request.body

    const statement = `insert into book (name, author, subject, price, status )
                        values
                        ('${name}','${author}','${subject}','${price}', 0 )`
    db.execute(statement,(error, data)=>{
        response.send(utils.createResult(error,data))
    })
})

//edit book
route.post('/edit-book/:id',(request,response)=>{
    const { id } = request.params
    const { name, author, subject, price } = request.body
    const statement = `update book set
                        name='${name}', author = '${author}', subject = '${subject}', price = ${price}
                        where id = ${id}`
    db.execute(statement,(error, data)=>{
        response.send(utils.createResult(error,data))
    })
})
module.exports = route