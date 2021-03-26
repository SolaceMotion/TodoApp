import React from 'react'
import axios from 'axios'
import { Container, Button, TextField, Card, CardContent } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { withStyles } from '@material-ui/core/styles'

const ColorButton = withStyles(theme => ({
  root: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}))(Button);


class TaskList extends React.Component {
  state = {
    task: '', // Entered task
    taskList: [] // Store all tasks
  }

  componentDidMount() {
    this.getTaskList()
  }

  getTaskList = () => {
    axios.get('http://localhost:4000/tasks')
    .then(response => response.data.recordset)
    .then(response => {
      this.setState({ taskList: response })
    })
  }

  onSubmitClick = () => {
    axios.post('http://localhost:4000/create-task', {
      task: this.state.task,
    })
    this.getTaskList()
    this.setState({task: ''})
  }
  onDeleteClick = (taskid) => {
    axios.delete(`http://localhost:4000/delete-task/${taskid}`)
    this.getTaskList()
  }
  
  render() {
    console.log(this.state.taskList)
    return (
      <Container>
        <h1>TaskList</h1>
          {/*<input type="text" value={this.state.task} onChange={e => this.setState({ task: e.target.value })} placeholder="Task" /> */}
          <TextField id="outlined-basic" label="Outlined" variant="outlined" value={this.state.task} onChange={e => this.setState({ task: e.target.value })}/>
          <Button variant="contained" color="primary" onClick={() => this.onSubmitClick()}>Submit</Button>
          <hr />
            {this.state.taskList.map((task) => (
              <Card>
                <CardContent>
                  <div>{task.tasks}</div>
                    <div>
                      <div>
                        <ColorButton variant="contained" color="secondary">Done</ColorButton>
                        <Button variant="contained" color="secondary" onClick={() => this.onDeleteClick(task.taskid)}>Delete</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Container>
    )
  }
}

export default TaskList
