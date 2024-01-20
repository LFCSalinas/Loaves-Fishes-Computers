const mail = require("../../services/mail");
require("dotenv").config();

// Mocking nodemailer's transporter - (So emails aren't actually sent live)
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({ messageId: 'fakeMessageId' }),
    }),
}));

test('should send email and return success message', async () => {
    const mailOptions = {
        from: process.env.MAIL_SENDER,
        to: process.env.MAIL_RECEIVER,
        subject: `Test Message`,
        text: `Message`
    };

    const result = await mail.sendMail(mailOptions);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Email sent successfully');
    expect(result.info.messageId).toBe('fakeMessageId');
});
