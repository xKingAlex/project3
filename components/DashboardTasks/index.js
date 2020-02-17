import React, { Component } from "react";
import NPLayout from "../NPLayout";
import { Form } from "react-bootstrap";
import { Card, Modal, Button } from "react-bootstrap";
import axios from "axios";

export default class DashboardTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showForm: false,
        setShowForm: false,
        show: false,
        setShow: false,
        TaskName: "",
        TaskDescription: "",
        TaskTeam: "",
        TaskDueDate: "",
    };
}

handleChange = e => {
  let objName = e.target.name;
  let objValue = e.target.value;

  this.setState({
    [objName]: objValue
  });
}

handleCreateTask = () => {
  let newTask = {
    taskName: this.state.TaskName,
    taskDescription: this.state.TaskDescription,
    taskDueDate: this.state.TaskDueDate,
    taskPriority: "",
    taskTeam: this.state.TaskTeam,
    taskStatus: "Working On"
  }
  
  axios.post("/api/newTask", newTask).then((response) => {
    if(response.status === 200){
      console.log("created task");
    }
  });
}

  handleClose = () => {
    this.setState({
      setShowForm: false
    });
  }

  handleShow = () => {
    this.setState({
      setShowForm: true
    });
  }

  handleShowModal = () => {
    this.setState({
      show: true
    })
  }

  handleHideModal = () => {
    this.setState({
      show: false 
    })
  }

  handleNewShow = () => {
    this.setState({
      showForm: true
    });
  }

  render() {
    if (this.state.showForm) {
      return (
        <NPLayout>
          <div className='row mt-5'>
            <div className='col-md-12 mx-auto'>
              <h2>Add Tasks to Complete</h2>

              <div className='row'>
                <div className='col-md-8'>
                  <Form>
                    <label htmlFor='TaskName'>Name of Tasks:</label>
                    <input
                      type='text'
                      name='TaskName'
                      className='form-control'
                      placeholder='Task Name'
                      onChange={this.handleChange.bind(this)}
                    />
                    <br />
                    <label htmlFor='TaskDescription'>Description of Task:</label>
                    <input
                      type='text'
                      name='TaskDescription'
                      className='form-control'
                      placeholder='Task Description'
                      onChange={this.handleChange.bind(this)}
                    />
                    <br />
                    <label htmlFor='TaskTeam'>
                      Which Team is This a Task For?
                  </label>
                    <input
                      type='text'
                      name='TaskTeam'
                      className='form-control'
                      placeholder='Team Name'
                      onChange={this.handleChange.bind(this)}
                    />
                    <br />
                    <label htmlFor='taskDueDate'>Due Date (MM/DD/YY): </label>
                    <input
                      type='text'
                      name='TaskDueDate'
                      className='form-control'
                      placeholder='02/29/20'
                      onChange={this.handleChange.bind(this)}
                    />
                    <br />
                    <Form.Group>
                      <Form.Label>Priority Level</Form.Label>
                      <Form.Control as='select'>
                        <option>High Priority</option>
                        <option>Medium Priority</option>
                        <option>Low Priority</option>
                      </Form.Control>
                    </Form.Group>
                    <br />
                    <button type="button" onClick={() => this.handleCreateTask()}>Add Task</button>
                    <br />
                  </Form>
                </div>
                <div className='col-md-4'>
                  <p>This is where Tasks will show up</p>
                </div>
              </div>
            </div>
          </div>
        </NPLayout>
      );
    } else {
      return (
        <div className='mt-5'>
          <h5>This is a div that will render all of the tasks as cards</h5>

          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Create a New Task</Card.Title>
              <Card.Text>Assigned or Unassigned</Card.Text>
              <Button variant='primary' onClick={() => this.handleNewShow()}>
                Create a New Task
            </Button>
            </Card.Body>
          </Card>

          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Task Name</Card.Title>
              <Card.Subtitle className='mb-2 text-muted'>
                Level of Priority
            </Card.Subtitle>
              <Card.Text>Assigned or Unassigned</Card.Text>
              <Button variant='danger'>Claim Task</Button>
              <Button variant='primary' onClick={() => this.handleShowModal()}>
                View Details
            </Button>
            </Card.Body>
          </Card>

          <Modal show={this.state.show} onHide={() => this.handleClose()}>
            <Modal.Header closeButton>
              <Modal.Title>Project Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='container'>
                <div className='row'>Project Description will go here</div>
                <div className='row'>Level of Priority</div>
                <div className='row'>Due Date</div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={() => this.handleHideModal()}>
                Close
            </Button>
              <Button variant='danger' onClick={() => this.handleClose()}>
                Claim Task
            </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }
};