const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'meysifairus.khosyi@gmail.com',
        pass: 'ullmmarragfqfxga'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter