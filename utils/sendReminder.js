const cron = require('node-cron');
const User = require('../models/userModel');
const Record = require('../models/recordModel');
const { sendReminderEmail } = require('./emailUtil');

const startReminderCron = () => {
	cron.schedule('30 9 10-15 * *', async () => {
		try {
			const now = new Date();
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

			const users = await User.find({});

			for (const user of users) {
				const recordExists = await Record.findOne({
					userId: user._id,
					createdAt: {
						$gte: startOfMonth,
						$lte: endOfMonth
					}
				});

				if (!recordExists) {
					await sendReminderEmail(user.email, now.toLocaleString('default', { month: 'long' }), now.getFullYear());
				}
			}
		} catch (error) {
			console.error('Error in reminder cron:', error);
		}
	});
};

module.exports = startReminderCron;