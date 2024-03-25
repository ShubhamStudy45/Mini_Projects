const express = require('express')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')

const config = require('../config')
const db = require('../db')
const utils = require('../utils')
const route = express.Router()

route.get('/',(request, response)=>{

})

//signup
route.post('/signup',(request, response)=>{

    const { firstname, lastname, email, password } = request.body

    const encryptPassword = '' + cryptoJs.SHA256(password)

    const statement = `insert into user
                        (firstname, lastname, email, password, status, priority)
                        values
                        ('${firstname}','${lastname}','${email}','${encryptPassword}', 0, 0)`
    // console.log(statement)
    db.execute(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
    
})

// signin
route.post('/signin',(request,response)=>{
    
    const { email, password } = request.body

    const decryptPassowrd = '' + cryptoJs.SHA256(password)
    const statement = `select id, firstname, lastname, email, phone, priority
                        from user
                        where
                        email = '${email}' and password = '${decryptPassowrd}'`
    db.execute(statement,(error,users)=>{

        const result = {
            status : ''
        }

        if(error){
            result['status'] = 'error'
            result['error'] = error
        }else{
            if(users.length <= 0){
                result['status'] = 'error'
                result['error'] = "User doesn't exist or password is incorrect..!!"
            }else{
                
                const user = users[0]

                const payload = {
                    id : user['id']
                }
                const token = jwt.sign(payload,config.secrete)
                // console.log(token)

                result['status'] = 'success'
                result['data'] = {
                    token : token,
                    firstname : user['firstname'],
                    lastname : user['lastname'],
                    email : user['email'],
                    phone : user.phone,
                    priority : user['priority']
                }


            }
        }
        
        response.send(result)
    })
})
route.put('/edit-profile/',(request, response)=>{

    const { id } = request.params

    const { firstname, lastname, phone } = request.body
    const statement = `update user set firstname = '${firstname}', lastname = '${lastname}', phone = '${phone}'
                        where
                        id = ${request.userId}`

    // console.log(statement)
    db.execute(statement,(error,data)=>{
        response.send(utils.createResult(error, data))
    })
})

//change password
route.patch('/edit-password/',(request, response)=>{

    const { oldpassword, newpassword } = request.body

    const statement = `select password from user where id=${request.userId}`

    // console.log(statement)
    db.execute(statement,(error, data)=>{
        const result = {
            status : ''
        }
        if(error){
            result['status'] = 'error'
            result['error'] = error
        }else{
            const userPassword = data[0]

            
            const decryptOldPassword = '' + cryptoJs.SHA256(oldpassword)
            // console.log(decryptOldPassword)
            if(userPassword['password'] == decryptOldPassword){

                const decryptNewPassword = '' + cryptoJs.SHA256(newpassword)

                const updatePass = `update user set password = '${decryptNewPassword}'
                                    where id = ${request.userId}`
                db.execute(updatePass,(error,data)=>{
                    response.send(utils.createResult(error,data))
                })
            }else{
                response.send({
                    status : 'error',
                    error : "Password not matching ..!!"
                })
            }
        }
    })

    
})
module.exports = route