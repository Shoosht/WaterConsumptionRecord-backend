require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const recordRoutes = require('./routes/records')

const app = express()

app.use(express.json())

app.use('/api/records', recordRoutes)

app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})

mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        app.listen(process.env.PORT, () =>{
            console.log('listening to the port and connected to the db')
        })
    })
    .catch((error)=>{
        console.log(error)
    })
