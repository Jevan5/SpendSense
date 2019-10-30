const nodemailer = require('nodemailer');

/**
 * Sends mail to a recipient.
 * @param {string} recipient Email of the recipient.
 * @param {string} subject Subject of the email.
 * @param {string} body Body of the email.
 * @returns {Promise} Resolves when the email has sent successfully.
 */
function sendMail(recipient, subject, body) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'virtualytics19@gmail.com',
            pass: 'RickAtSpoke'
        }
    });

    let mailOptions = {
        from: 'virtualytics19@gmail.com',
        to: recipient,
        subject: subject,
        text: body
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendMail: sendMail
};