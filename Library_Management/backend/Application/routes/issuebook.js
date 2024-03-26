const express = require('express')
const moment = require('moment')
const mysql = require('mysql2/promise')

const db = mysql.createPool({
    host : '0.0.0.0',
    user : 'root',
    password : '1947',
    database : 'librarydb'
})
const utils = require('../utils')
const route = express.Router()


route.post('/issue-copy',(request, response)=>{

    (async()=>{

        //step 1 : get the cart item into cart

        const cartStmt = `
        select 
            c.id as cartid, cp.id as copy_id, b.price as price, c.quantity as quantity, c.user as userid
        from 
            cart c inner join book b 
        on 
            c.book = b.id inner join copies cp 
        on 
            c.copy_id = cp.id
        where 
        user = ${request.userId}`
        // console.log(cartStmt)

        const [items] = await db.query(cartStmt)
        // console.log(items)
        let totalPrice = 0
        for(const item of items){
            totalPrice += item['price'] * item['quantity']
        }
        // console.log(totalPrice)
        const date = moment().format('DD/MM/YYYY')
        // console.log(date)
        //step 2 : add the items into user order table and add record into issue copy book
        const addUserStmt = `insert into userorder (user, totalprice, paidamount, orderdate, status)
                            values
                            (${request.userId}, ${totalPrice},${totalPrice},'${date}', 0)`

        // const [UserResults] = await db.query(addUserStmt)
        
        // console.log(UserResults['insertId'])
        let date1 = new Date(date)
        console.log(date1)
        
        // console.log(return_due_date)
        /*const issueRecordStmt = `
        insert into issuerecord 
            (orderid, copy_id, member_id, issue_date, return_due_date, return_date, fine_amount)
        values
            (${UserResults['insertId']},${request.userId},'${date}')`*/
        //step 3 : delete the item into cart
        response.send()

    })()

})
module.exports = route