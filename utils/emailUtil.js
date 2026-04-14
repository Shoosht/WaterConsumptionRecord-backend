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

const sendForgotPasswordEmail = async (userEmail, resetToken) => {
    try {
        const transporter = await createTransporter();
        
        const reset_url = `http://localhost:3000/reset-password/${resetToken}`;
        
        const info = await transporter.sendMail({
            from: '<alert@waterconsumption.com>',
            to: userEmail,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2982bd;">Password Reset Request</h2>
                    <p>You requested to reset your password. Click the button below to reset it:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${reset_url}" style="background-color: #2982bd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #666;">Or copy and paste this link into your browser:</p>
                    <p style="background-color: #f4f4f4; padding: 10px; word-break: break-all; font-size: 12px;">
                        ${reset_url}
                    </p>
                    <p style="color: #dc3545; font-size: 14px; margin-top: 20px;">
                        <strong>This link will expire in 1 hour.</strong>
                    </p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        If you didn't request this, please ignore this email. Your password will remain unchanged.
                    </p>
                    <p style="color: #666; font-size: 12px;">
                        This is an automated message from Water Consumption Record. Please do not reply.
                    </p>
                </div>
            `
        });
        
        console.log('Password reset email sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
        return nodemailer.getTestMessageUrl(info);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

const sendReminderEmail = async (userEmail, month, year) => {
	try {
		const transporter = await createTransporter();
		
        const site_url = "http://localhost:3000";

		const info = await transporter.sendMail({
			from: '<alert@waterconsumption.com>',
			to: userEmail,
			subject: 'Action Required: Monthly Water Record Missing',
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2 style="color: #2982bd;">Monthly Record Reminder</h2>
					<p>We noticed you haven't logged your water consumption for <strong>${month} ${year}</strong> yet.</p>
					<div style="text-align: center; margin: 30px 0;">
						<a href="${site_url}" style="background-color: #2982bd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
							Log Record Now
						</a>
					</div>
					<p style="color: #666; font-size: 12px;">
						If you have already submitted your record in the last few minutes, please ignore this email.
					</p>
				</div>
			`
		});

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	} catch (error) {
		console.error('Email reminder failed:', error);
	}
};
 
module.exports = { sendLimitExceededEmail, sendForgotPasswordEmail, sendReminderEmail };