const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    city:{
        type: String,
        default: ''
    },
    address:{
        type: String,
        default: ''
    },
    name:{
        type: String,
        default: ''
    },
    monthlyLimit: {
        type: Number,
        default: 1000
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
})

userSchema.statics.login = async function(email, password) {

    if (!email || !password) {
        throw Error('All fields must be filled.')
    }
    
    const user = await this.findOne({ email })

    if (!user) {
        throw Error('Incorrect email.')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect password')
    }

    return user
}

userSchema.statics.signup = async function(email, password) {

    if (!email || !password) {
        throw Error('All fields must be filled.')
    }

    if(!validator.isEmail(email)) {
        throw Error('Email provided is not valid')

    }

    if(!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough.')
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use.')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash})

    return user
}

userSchema.statics.changePassword = async function(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
        throw Error('All fields must be filled.')
    }

    if (!validator.isStrongPassword(newPassword)) {
        throw Error('New password not strong enough.')
    }

    const user = await this.findById(userId)
    if (!user) {
        throw Error('User not found.')
    }

    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) {
        throw Error('Current password is incorrect.')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(newPassword, salt)
    
    user.password = hash
    await user.save()
    
    return user
}

module.exports = mongoose.model('User', userSchema)