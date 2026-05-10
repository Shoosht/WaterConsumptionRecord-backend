require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const recordRoutes = require('./routes/records')
const userRoutes = require('./routes/users')
const billRoutes = require('./routes/bills')
const startReminderCron = require('./utils/sendReminder')


const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL
}))

app.use(express.json())

app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})

app.use('/api/records', recordRoutes)
app.use('/api/user', userRoutes)
app.use('/api/bills', billRoutes)


mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        app.listen(process.env.PORT, () =>{
            console.log('listening to the port and connected to the db')
            startReminderCron();
        })
    })
    .catch((error)=>{
        console.log(error)
    })
