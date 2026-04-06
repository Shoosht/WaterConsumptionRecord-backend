const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { sendForgotPasswordEmail } = require('../utils/emailUtil');

const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.SECRET, { expiresIn: '30m' })
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

const changePassword = async (req, res) => {
    const { id } = req.params
    const { currentPassword, newPassword } = req.body

    try {
        await User.changePassword(id, currentPassword, newPassword)
        res.status(200).json({ message: 'Password changed successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
 
    try {
        const user = await User.findOne({ email });
 
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address.' });
        }
 
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
 
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();
 
        const previewUrl = await sendForgotPasswordEmail(email, resetToken);
        
        res.status(200).json({ 
            message: 'Password reset link has been sent to your email.',
            previewUrl
        });
 
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Error processing password reset request.' });
    }
};
 
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
 
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
 
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
 
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }
 
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }
 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
 
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
 
        res.status(200).json({ message: 'Password has been reset successfully.', user: { email: user.email } });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
};

module.exports = { loginUser, signupUser, updateUser, changePassword, forgotPassword, resetPassword }