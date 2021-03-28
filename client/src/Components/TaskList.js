import React from "react"
import axios from "axios"
import {
  Container,
  Button,
  TextField,
  Card,
  CardContent,
  Box,
} from "@material-ui/core"
import { green } from "@material-ui/core/colors"
import { withStyles } from "@material-ui/core/styles"
import Swal from "sweetalert2"

const ColorButton = withStyles(theme => ({
  root: {
    color: green[500],
    borderColor: green[500],
    "&:hover": {
      color: green[700],
      borderColor: green[700],
    },
  },
}))(Button)

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      task: "", // Entered task
      taskList: [], // Store all tasks
      searchValue: "",
      fields: [],
    }
  }

  componentDidMount() {
    //componentDidMount calls the getTaskList after all other components are loaded
    this.getTaskList()
  }

  getTaskList = () => {
    axios
      .get("http://localhost:4000/tasks")
      .then(response => response.data.recordset)
      .then(response =>
        this.setState({ taskList: response }, () => {
          console.log(this.state.taskList) //See if a row is added and if state changes
        })
      )
      .catch(err => err)
  }

  onSubmitClick = () => {
    axios.post("http://localhost:4000/create-task", {
      task: this.state.task,
    })
    this.getTaskList()
    this.setState({ task: "" })
  }

  onDeleteClick = taskid => {
    axios.delete(`http://localhost:4000/delete-task/${taskid}`)
    this.getTaskList()
  }

  onDeleteAll = () => {
    axios.delete("http://localhost:4000/delete-all")
    this.getTaskList()
  }

  render() {
    /* SearchBar */
    const filteredSearch = this.state.taskList.filter(task => {
      //Filter search to return true only when search query matches a task
      return task.tasks
        .toLowerCase()
        .startsWith(this.state.searchValue.toLowerCase()) //startsWith or include method toLowerCase so you can type in uppercase and lowercase
    })

    return (
      <Container>
        <h1>TodoApp</h1>
        <Box display="flex" justifyContent="space-between">
          <div>
            {/*<input type="text" value={this.state.task} onChange={e => this.setState({ task: e.target.value })} placeholder="Task" /> */}
            <TextField
              className="outlined-basic"
              label="Type Todo"
              variant="standard"
              value={this.state.task}
              onChange={e => this.setState({ task: e.target.value })}
            />
            <Button
              size="large"
              variant="outlined"
              color="primary"
              onClick={() => {
                this.onSubmitClick()
                Swal.fire("Todo Added!", "", "success")
              }}
            >
              Add
            </Button>

            <Button
              size="large"
              variant="outlined"
              color="primary"
              onClick={() =>
                Swal.fire({
                  title: `Remove All Todos?`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: `Remove`,
                }).then(result => {
                  if (result.isConfirmed) {
                    Swal.fire("Removed All Tasks!", "", "success")
                    this.onDeleteAll()
                  }
                })
              }
            >
              Remove All
            </Button>
          </div>
          <TextField
            className="outlined-basic"
            label="Search Todos"
            variant="standard"
            value={this.state.searchValue}
            onChange={e => this.setState({ searchValue: e.target.value })}
          />
        </Box>
        <hr />
        <Box display="flex" flexWrap="wrap" flexGrow={1} textAlign="center">
          {filteredSearch.map((task, index) => {
            return (
              <Card
                key={index}
                style={{
                  minWidth: 33.3 + "%",
                  marginBottom: 5,
                  marginTop: 5,
                }}
              >
                <CardContent>
                  <h2>{task.tasks}</h2>
                  <div>
                    <div>
                      <ColorButton
                        fullWidth
                        variant="outlined"
                        onClick={() =>
                          Swal.fire({
                            title: `Remove This Todo?`,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: `Remove`,
                          }).then(result => {
                            if (result.isConfirmed) {
                              Swal.fire("Removed!", "", "success")
                              this.onDeleteClick(task.taskid)
                            }
                          })
                        }
                      >
                        Done
                      </ColorButton>
                      {/* <Button variant="contained" color="secondary" onClick={() => this.onDeleteClick(task.taskid)}>Delete</Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </Box>
      </Container>
    )
  }
}

export default TaskList
