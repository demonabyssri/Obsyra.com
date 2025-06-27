const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
};
const transporter = nodemailer.createTransport(sgTransport(options));

module.exports = transporter;