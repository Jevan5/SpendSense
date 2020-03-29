const nodemailer    = require('nodemailer');
const secrets       = require('../../secrets.json');

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
            user: secrets.emailAddress,
            pass: secrets.emailPassword
        }
    });

    let mailOptions = {
        from: secrets.emailAddress,
        to: recipient,
        subject: subject,
        text: body
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendMail: sendMail
};