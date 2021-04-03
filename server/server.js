require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sql = require('mssql')
const app = express()

app.use(cors())
app.use(express.json())

const dbConfig = require('./db')

sql.connect(dbConfig, err => {
  if (err) return console.error(err)

  const server = app.listen(4000, () => {
    console.log('Listening on http://localhost:4000')
  })
  server.on('close', sql.close.bind(sql))
})

/*-----Routes-----*/

app.get('/tasks', (req, res) => {
  const request = new sql.Request()

  request
    .query('SELECT * FROM TasksTbl')
    .then(recordset => res.send(recordset))
    .catch(err => console.log(err))
})

app.post('/create-task', (req, res) => {
  const request = new sql.Request()
  request.input('tasks', sql.NVarChar, req.body.task) //Sql Parameter

  request
    .query('INSERT INTO TasksTbl(tasks) VALUES(@tasks)')
    .catch(err => console.log(err))

  console.log('Added task successfully')
})

app.delete('/delete-task/:taskid', (req, res) => {
  const request = new sql.Request()
  request.input('taskid', sql.Int, req.params.taskid)

  request
    .query('DELETE FROM TasksTbl WHERE taskid = @taskid')
    .then(console.log('Deleted'))
    .catch(err => console.error(err))
})

app.delete('/delete-all', (req, res) => {
  const request = new sql.Request()

  request
    .query('TRUNCATE TABLE TasksTbl')
    .then(console.log('Deleted all'))
    .catch(err => console.error(err))
})

/*-----/Routes-----*/
