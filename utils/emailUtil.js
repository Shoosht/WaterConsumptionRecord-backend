const nodemailer = require('nodemailer');

const createTransporter = async () => {
    const testAccount = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
    
    return transporter;
};

const sendLimitExceededEmail = async (userEmail, amount, monthlyLimit, month, year) => {
    try {
        const transporter = await createTransporter();
        
        const info = await transporter.sendMail({
            from: '<alert@waterconsumption.com>',
            to: userEmail,
            subject: 'Monthly Water Limit Exceeded',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #dc3545;">Water Consumption Alert</h2>
                    <p>Your water consumption for <strong>${month}/${year}</strong> has exceeded your monthly limit.</p>
                    <div style="background-color: #fff4f4; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Consumption:</strong> ${amount} m³</p>
                        <p style="margin: 5px 0;"><strong>Monthly Limit:</strong> ${monthlyLimit} m³</p>
                        <p style="margin: 5px 0;"><strong>Exceeded by:</strong> ${(amount - monthlyLimit).toFixed(1)} m³</p>
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        This is an automated message from Water Consumption Record. Please do not reply.
                    </p>
                </div>
            `
        });
        
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
        return nodemailer.getTestMessageUrl(info);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendLimitExceededEmail };