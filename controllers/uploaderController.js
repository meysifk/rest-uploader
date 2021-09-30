const { db } = require('../database')
const { uploader } = require('../helper/uploader')
const fs = require('fs')

module.exports = ({
    uploadFile: (req, res) => {
        try {
            let path = '/images'
            const upload = uploader(path, 'IMG').fields([{ name: 'file' }])

            upload(req, res, (error) => {
                if (error) {
                    console.log(error)
                    res.status(500).send(error)
                }

                const { file } = req.files
                const filepath = file ? path + '/' + file[0].filename : null

                let data = JSON.parse(req.body.data)
                data.image = filepath

                let sqlInsert = `Insert into album values (null,${db.escape(data.title)},${db.escape(data.description)},${db.escape(filepath)})`
                db.query(sqlInsert, (err, results) => {
                    if (err) {
                        console.log(err)
                        fs.unlinkSync('./public' + filepath)
                        res.status(500).send(err)
                    }
                    res.status(200).send({ message: "Upload file success" })
                })
            })
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getAlbum: (req, res) => {
        let sqlGet = 'Select * from album;'

        db.query(sqlGet, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    }
})