const express = require('express')
const cors = require('cors')
const bearerToken = require('express-bearer-token')

const PORT = 3300
const app = express()

app.use(cors())
app.use(express.json())
app.use(bearerToken())

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.status(200).send('<h4>Integrated mysql with express</h4>')
})

const { userRouters, uploadRouter } = require('./routers')

app.use('/users', userRouters)
app.use('/album', uploadRouter)

app.listen(PORT, () => console.log('Api Running :', PORT));