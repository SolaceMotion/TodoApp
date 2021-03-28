require("dotenv").config()
const express = require("express")
const cors = require("cors")

const sql = require("mssql")
const app = express()

app.use(cors())
app.use(express.json())

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  port: 3000,
  database: process.env.DB_NAME,
  stream: false,
  options: {
    port: 3000,
    encrypt: false,
    enableArithAbort: true,
  },
}

sql.connect(dbConfig, err => {
  if (err) return console.error(err)

  const server = app.listen(4000, () => {
    console.log("Listening on http://localhost:4000")
  })
  server.on("close", sql.close.bind(sql))
})

/*-----Routes-----*/

app.get("/tasks", (req, res) => {
  const request = new sql.Request()

  const TASK_QUERY = "SELECT * FROM TasksTbl"

  request.query(TASK_QUERY, (err, response) => {
    if (err) {
      return console.log(err)
    }
    res.send(response)
  })
})

app.post("/create-task", (req, res) => {
  const request = new sql.Request()
  request.input("tasks", sql.NVarChar, req.body.task) //Sql Parameter

  const ADD_QUERY = "INSERT INTO TasksTbl(tasks) VALUES(@tasks)"

  request.query(ADD_QUERY, err => {
    if (err) {
      return console.log(err)
    }
    console.log("Added task successfully")
  })
})

app.delete("/delete-task/:taskid", (req, res) => {
  const request = new sql.Request()
  request.input("taskid", sql.Int, req.params.taskid)

  const DELETE_QUERY = "DELETE FROM TasksTbl WHERE taskid = @taskid"

  request.query(DELETE_QUERY, (err, response) => {
    if (err) {
      return console.log(err)
    }
  })
})

app.delete("/delete-all", (req, res) => {
  const request = new sql.Request()

  request.query("TRUNCATE TABLE TasksTbl", err => {
    if (err) {
      return console.error(err)
    }
  })
})

/*-----/Routes-----*/
