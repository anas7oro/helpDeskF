const nodemailer = require('nodemailer');


const sendEmail = async function sendEmail(email, subject, html) {
    console.log('sendEmail function was called');
   const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'infohelpdesk00@gmail.com',
            pass: 'arlbbjntovrlytmn'
        }
    });

    const info = await transporter.sendMail({
        from: 'Help Desk <infohelpdesk00@gmail.com',
        to: email,
        subject: subject,
        html: html
    });

    console.log('Message sent: %s', info.messageId);
}

module.exports = sendEmail;