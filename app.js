const express = require('express')
const logger = require('morgan')
const cors = require('cors')


const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use((_req, res) => {
      res.status(404).send({ massege: 'Not found' })
  })

app.use((err, _req, res, _next) => {
      res.status(500).send({ massege: err.massege })
  })

module.exports = app

