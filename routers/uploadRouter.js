const express = require('express')
const { uploadController } = require('../controllers')
const route = express.Router()

route.post('/upload', uploadController.uploadFile)
route.get('/get', uploadController.getAlbum)
module.exports = route