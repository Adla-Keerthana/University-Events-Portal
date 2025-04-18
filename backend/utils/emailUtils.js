import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async ({ to, subject, text }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not configured. Skipping email send.');
        return { success: true, message: 'Email skipped - credentials not configured' };
    }

    try {
        const info = await transporter.sendMail({
            from: `"University Events" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });
        console.log('Email sent successfully:', info.messageId);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error.message);
        return { 
            success: false, 
            message: `Failed to send email: ${error.message}`,
            error: error 
        };
    }
}; 