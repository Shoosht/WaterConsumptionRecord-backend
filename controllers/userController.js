const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.SECRET, { expiresIn: '3d' })
}

const loginUser = async (req, res) =>{
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)

        const token = createToken(user._id)

        res.status(200).json({
            email: user.email,
            token,
            _id: user._id,
            name: user.name || '',
            city: user.city || '',
            address: user.address || '',
            monthlyLimit: user.monthlyLimit || 1000
        })
    } catch (error) {
        res.status(400).json({error: error.message})
    } 
}

const signupUser = async (req, res) =>{
    const { email, password } = req.body

    try {
        const user = await User.signup(email, password)

        const token = createToken(user._id)

        res.status(200).json({
            email: user.email,
            token,
            _id: user._id,
            name: user.name || '',
            city: user.city || '',
            address: user.address || '',
            monthlyLimit: user.monthlyLimit || 1000
        })
    } catch (error) {
        res.status(400).json({error: error.message})
    } 
}

const updateUser = async (req, res) =>{
    const { id } = req.params
    const { name, city, address, email, monthlyLimit } = req.body


    try {
        const user = await User.findByIdAndUpdate(id,
            { name, city, address, email, monthlyLimit },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { loginUser, signupUser, updateUser }