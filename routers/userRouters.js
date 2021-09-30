const express = require('express')
const { userControllers } = require('../controllers')
const { auth } = require('../helper/authToken')
const routers = express.Router()

routers.post('/login', userControllers.getData)
routers.post('/regis', userControllers.addData)
routers.patch('/edit', userControllers.editData)
routers.patch('/verified', auth, userControllers.verification)
routers.get('/get', userControllers.getAllUsers)

module.exports = routers