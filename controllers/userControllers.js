const { db } = require('../database')
const { createToken } = require('../helper/createToken')
const Crypto = require('crypto')
const transporter = require('../helper/nodemailer')

module.exports = {
    getData: (req, res) => {
        req.body.password = Crypto.createHmac("sha1", "hash123").update(req.body.password).digest("hex")
        let scriptQuery = `Select * from users where email=${db.escape(req.body.email)} and password=${db.escape(req.body.password)};`
        console.log(req.body, scriptQuery)
        db.query(scriptQuery, (err, results) => {
            if (err) res.status(500).send(err)
            if (results[0]) {
                let { idusers, username, email, password, role, status } = results[0]
                let token = createToken({ idusers, username, email, password, role, status })
                if (status != "verified") {
                    res.status(200).send({ message: "Your account not verified" })
                } else {
                    res.status(200).send({ dataLogin: results[0], token, message: "Login Success" })
                }
            }
        })
    },
    addData: (req, res) => {
        console.log(req.body)
        let { username, email, password } = req.body
        password = Crypto.createHmac("sha1", "hash123").update(password).digest("hex")
        console.log(password)
        let insertQuery = `Insert into users values (null,${db.escape(username)},${db.escape(email)},${db.escape(password)},'user','unverified');`
        console.log(insertQuery)
        db.query(insertQuery, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            }
            if (results.insertId) {
                let sqlGet = `Select * from users where idusers = ${results.insertId};`
                db.query(sqlGet, (err2, results2) => {
                    if (err2) {
                        console.log(err2)
                        res.status(500).send(err2)
                    }

                    // create data token
                    let { idusers, username, email, role, status } = results2[0]
                    let token = createToken({ idusers, username, email, role, status })

                    let mail = {
                        from: `Admin <leadwear01@gmail.com>`,
                        to: `${email}`,
                        subject: 'Account Verification',
                        html: `<a href='http://localhost:3000/authentication/${token}'>Click here for verification your account</a>`
                    }

                    transporter.sendMail(mail, (errMail, resMail) => {
                        if (errMail) {
                            console.log(errMail)
                            res.status(500).send({ message: "Registration Failed!", success: false, err: errMail })
                        }
                        res.status(200).send({ message: "Registration Success, Check Your Email!", success: true })
                    })
                })
            }
        })
    },
    verification: (req, res) => {
        console.log(req.user)
        let updateQuery = `Update users set status='verified' where idusers = ${req.user.idusers};`

        db.query(updateQuery, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send({ message: "Verified Account", success: true })
        })
    },
    editData: (req, res) => {
        let dataUpdate = []
        for (let prop in req.body) {
            dataUpdate.push(`${prop} = ${db.escape(req.body[prop])}`)
        }
        let updateQuery = `UPDATE users set ${dataUpdate} where idusers = ${req.params.id};`
        console.log(updateQuery)
        db.query(updateQuery, (err, results) => {
            if (err) res.status(500).send(err)
            res.status(200).send(results)
        })
    },
    getAllUsers: (req, res) => {
        // if (req.user.role == "admin") {
        let updateQuery = `Select * from users;`
        console.log(updateQuery)
        db.query(updateQuery, (err, results) => {
            if (err) res.status(500).send(err)
            res.status(200).send(results)
        })
        // } else {
        //     res.status(200).send({ message: "You are not admin, can't access data" })
        // }
    }
}