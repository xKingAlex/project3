import React, { Component } from "react";
import NPLayout from "../NPLayout";
import { Form, ThemeProvider } from "react-bootstrap";
import { Card, Modal, Button } from "react-bootstrap";
import axios from "axios";
import FormMessage from "../FormMessage/index";

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
      TaskPriority: "",
      TaskDueDate: "",
      allTeams: [],
      allTasks: [],
      userTasks: [],
      isCreatingTask: false,
      isNameClicked: false,
      isDescriptionClicked: false,
      newTaskNameHover: false,
      newTaskDescriptionHover: false,
      newTaskName: "",
      newTaskDescription: "",
      newTaskDueDate: "",
      newTaskPriority: "",
      deleteTaskId: -1,
      isError: false,
      errorMsg: "",
      modalID: -1
    };
  }

  componentDidMount() {
    this.getAllProjectTaskInfo();

    this.timerID = setInterval(() => this.getAllProjectTaskInfo(), 1000);
  }

  async getAllProjectTaskInfo() {
    var isCreatingTask = this.state.isCreatingTask;

    if (isCreatingTask === false) {
      var url = window.location.href;
      var projectId = url.split("/")[4];

      await this.getAllTeams(projectId);
      await this.getAllTasks(projectId);
      await this.getUserTasks(projectId);
    }
  }

  async getAllTeams(projectId) {
    var newArr = [];

    await axios.get(`/api/allTeams/${projectId}`).then(response => {
      for (var i = 0; i < response.data.length; i++) {
        newArr.push(response.data[i].teamName);
      }
    });

    this.setState({
      allTeams: newArr
    });
  }

  async getAllTasks(projectId) {
    var newArr = [];

    await axios.get(`/api/allTasks/${projectId}`).then(response => {
      for (var i = 0; i < response.data.length; i++) {
        var newTask = {
          id: response.data[i].id,
          name: response.data[i].taskName,
          description: response.data[i].taskDescription,
          dueDate: response.data[i].taskDueDate,
          priority: response.data[i].taskPriority,
          team: response.data[i].taskTeam,
          status: response.data[i].taskStatus
        };

        newArr.push(newTask);
      }
    });

    this.setState({
      allTasks: newArr
    });
  }

  handleChange = e => {
    let objName = e.target.name;
    let objValue = e.target.value;

    this.setState({
      [objName]: objValue
    });
  };

  handleTaskStatusChange = e => {
    let objName = e.target.name;
    let objValue = e.target.value;
    let objId = parseInt(e.target.id);

    var newAllTasks = [];

    for (var i = 0; i < this.state.userTasks.length; i++) {
      console.log("pushing... " + this.state.userTasks[i]);
      newAllTasks.push(this.state.userTasks[i]);
    }

    for (var i = 0; i < newAllTasks.length; i++) {
      if (newAllTasks[i].id === objId) {
        console.log("found : " + newAllTasks[i].id);
        newAllTasks[i].status = objValue;
      }
    }

    this.setState({
      allTasks: newAllTasks
    });

    this.updateTaskStatus(objId, objValue);
  };

  async updateTaskStatus(id, value) {
    var newVal = {
      taskStatus: value
    };

    await axios.put(`/api/updateStatus/${id}`, newVal).then(response => {
      console.log("updated db");
    });
  }

  handleCreateTask = team => {
    if (this.state.taskName === "" || this.state.newTaskDescription === "") {
      this.setState({
        isError: true,
        errorMsg: "Task Name and description must be complete"
      });
    } else {
      var teamName = Object.values(team)[0];
      var url = window.location.href;
      var splitUrl = url.split("/")[4];

      let newTask = {
        projectId: splitUrl,
        taskName: this.state.newTaskName,
        taskDescription: this.state.newTaskDescription,
        taskDueDate: this.state.newTaskDueDate,
        taskPriority: this.state.newTaskPriority,
        taskTeam: teamName,
        taskStatus: "Unassigned"
      };

      axios.post("/api/newTask", newTask).then(response => {
        if (response.status === 200) {
          console.log("created task");
        }

        this.setState({
          isCreatingTask: false
        });

        this.handleShowAllTasks();
      });
    }
  };

  handleCancelCreation = () => {
    this.setState({
      isCreatingTask: false
    });
  };

  handleClaimTask = e => {
    var objId = e.target.name;

    axios.put(`/api/claimTask/${objId}`).then(response => {
      console.log("updated task in db");
    });
  };

  handleUnclaimTask = e => {
    var objId = e.target.name;

    axios.put(`/api/unclaimTask/${objId}`).then(response => {
      console.log("unclaimedTask");
    });

    console.log(this.state);

    // axios.put(`/api/unclaimTask/${objId}`).then(response => {
    //   console.log("updated task in db");
    // });
  };

  handleClose = () => {
    this.setState({
      setShowForm: false
    });
  };

  handleShow = () => {
    this.setState({
      setShowForm: true
    });
  };

  handleShowModal = id => {
    this.setState({
      modalID: id,
      show: true
    });
  };

  handleHideModal = () => {
    this.setState({
      show: false
    });
  };

  handleNewShow = () => {
    this.setState({
      showForm: true
    });
  };

  handleShowAllTasks = () => {
    this.getAllProjectTaskInfo();

    this.setState({
      showForm: false
    });
  };

  handleToggleMouseOver = obj => {
    var stateName = obj + "Hover";
    var oppositeVal = !this.state[stateName];

    this.setState({
      [stateName]: oppositeVal
    });
  };

  handleDeleteTaskInfo = e => {
    console.log("clicked");

    var newTaskId = e.target.id;

    console.log("clicked: " + newTaskId);

    this.setState({
      deleteTaskId: newTaskId
    });
  };

  handleDeleteTask() {
    var taskId = this.state.deleteTaskId;

    axios.delete(`/api/deleteTask/${taskId}`).then(response => {
      console.log("deleted task!");
    });

    this.handleHideModal();
  }

  async getUserTasks(projectId) {
    var newArr = [];

    await axios.get(`/api/userTasks/${projectId}`).then(response => {
      for (var i = 0; i < response.data.length; i++) {
        var newTask = {
          id: response.data[i].id,
          name: response.data[i].taskName,
          description: response.data[i].taskDescription,
          dueDate: response.data[i].taskDueDate,
          priority: response.data[i].taskPriority,
          team: response.data[i].taskTeam,
          status: response.data[i].taskStatus
        };

        newArr.push(newTask);
      }
    });

    this.setState({
      userTasks: newArr
    });
  }

  createTask(team) {
    console.log(this.state);

    this.setState({
      isCreatingTask: true
    });

    var teamName = Object.values(team)[0];
    var newArr = [];

    var url = window.location.href;
    var splitUrl = url.split("/")[4];
    let newTask = {
      id: -1,
      name: "Task Name",
      description: "Task Description",
      dueDate: "Task Due Date",
      priority: "Task Priority",
      team: teamName,
      status: "Unassigned"
    };

    newArr.push(newTask);

    var allTasks = this.state.allTasks;
    for (var i = 0; i < allTasks.length; i++) {
      newArr.push(allTasks[i]);
    }

    this.setState({
      allTasks: newArr
    });

    console.log("updated");
  }

  edit(elementToEdit) {
    if (elementToEdit === "name") {
      this.setState({
        isNameClicked: true,
        isDescriptionClicked: false,
        newTaskNameHover: false,
        newTaskDescriptionHover: false
      });
    } else if (elementToEdit === "description") {
      this.setState({
        isNameClicked: false,
        isDescriptionClicked: true,
        newTaskNameHover: false,
        newTaskDescriptionHover: false
      });
    } else if (elementToEdit === "none") {
      this.setState({
        isNameClicked: false,
        isDescriptionClicked: false,
        newTaskNameHover: false,
        newTaskDescriptionHover: false
      });
    }
  }

  render() {
    const isError = this.state.isError;
    const isNameClicked = this.state.isNameClicked;
    const isDescriptionClicked = this.state.isDescriptionClicked;

    var newTaskNameStyle;
    var newTaskDescriptionStyle;

    if (this.state.newTaskNameHover) {
      newTaskNameStyle = {
        color: "#2190cc",
        fontWeight: "bolder",
        border: "1px solid #2190cc",
        cursor: "pointer"
      };
    } else
      newTaskNameStyle = {
        color: "#242424",
        border: "none",
        cursor: "pointer"
      };

    if (this.state.newTaskDescriptionHover) {
      newTaskDescriptionStyle = {
        color: "#2190cc",
        fontWeight: "bolder",
        border: "1px solid #2190cc",
        cursor: "pointer"
      };
    } else {
      newTaskDescriptionStyle = {
        color: "#242424",
        border: "none",
        cursor: "pointer"
      };
    }

    return (
      <React.Fragment>
        <div className='team-container p-4'>
          <div className='row'>
            <div className='col-lg-12 mb-2'>
              <h1 className='team-header'>My Tasks</h1>
              <hr></hr>
            </div>
          </div>
          <div className='row'>
            {this.state.userTasks.map(userTask => {
              return (
                <div className='col-lg-3 mb-2 px-1'>
                  <div className='task-card card'>
                    <div className='card-body d-flex flex-column over'>
                      <div className='d-flex justify-content-between'>
                        <span>
                          <h5 className='task-name card-title mt-3'>
                            {userTask.name}
                          </h5>
                        </span>
                        <span className='align-right'>
                          <a onClick={() => this.handleShowModal(userTask.id)}>
                            <h5
                              id={userTask.id}
                              onClick={e => this.handleDeleteTaskInfo(e)}
                              className='delete mt-3'
                            >
                              X
                            </h5>
                          </a>
                        </span>
                      </div>
                      <div className='card-subtitle mb-1 text-muted'>
                        {userTask.description}
                      </div>
                      <div className='card-subtitle mb-1 text-muted'>
                        {userTask.priority}
                      </div>
                      <Form.Group>
                        <Form.Control
                          id={userTask.id}
                          placeholder='Task Status'
                          defaultValue={userTask.status}
                          onChange={this.handleTaskStatusChange.bind(this)}
                          as='select'
                          name='newTaskPriority'
                        >
                          <option value='N/A' disabled selected>
                            Task Status
                          </option>
                          <option
                            value='Working On'
                            style={{ color: "#2ab009", fontWeight: "bold" }}
                          >
                            Working On
                          </option>
                          <option
                            value='Stuck'
                            style={{ color: "#e1651b", fontWeight: "bold" }}
                          >
                            Stuck
                          </option>
                          <option
                            value='Completed'
                            style={{ color: "#ffaa0a", fontWeight: "bold" }}
                          >
                            Completed
                          </option>
                        </Form.Control>
                      </Form.Group>
                      <div className='row my-auto '>
                        <a
                          name={userTask.id}
                          className='task-btn text-left mx-auto pointer'
                          onClick={e => {
                            this.handleUnclaimTask(e);
                          }}
                        >
                          Unclaim Task
                          <i className='pl-2 far fa-minus-square text-right'></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {this.state.allTeams.map(team => {
          return (
            <React.Fragment>
              <div className='team-container mt-3 p-4'>
                <div className='row px-2'>
                  <div className='col-lg-6'>
                    <h2 className='team-header align-middle'>{team}</h2>
                  </div>
                  <div className='col-lg-6'>
                    <button
                      className='btn px-5 float-right'
                      onClick={() => this.createTask({ team })}
                    >
                      Create New Task
                    </button>
                  </div>
                </div>
                <hr></hr>
                <div className='row px-2 my-3'>
                  {this.state.allTasks.map(task => {
                    if (task.team === team) {
                      if (task.status === "Unassigned") {
                        return task.id === -1 ? (
                          <div className='col-lg-3 mb-2'>
                            <div className='task-card card'>
                              <div className='card-body d-flex flex-column over'>
                                {isNameClicked ? (
                                  <div>
                                    <h5 className='task-name mx-auto  card-title mt-3'>
                                      <input
                                        text='text'
                                        name='newTaskName'
                                        value={this.state.newTaskName}
                                        onChange={this.handleChange.bind(this)}
                                      ></input>
                                    </h5>
                                    <div
                                      className='card-subtitle mb-1 text-muted'
                                      onMouseOver={() =>
                                        this.handleToggleMouseOver(
                                          "newTaskDescription"
                                        )
                                      }
                                      onClick={() => this.edit("description")}
                                    >
                                      {this.state.newTaskDescription === "" ? (
                                        <p style={newTaskDescriptionStyle}>
                                          {task.description}
                                        </p>
                                      ) : (
                                        <p style={newTaskDescriptionStyle}>
                                          {this.state.newTaskDescription}
                                        </p>
                                      )}
                                    </div>
                                    <div
                                      className='card-subtitle mb-1 text-muted'
                                      onClick={() => this.edit("none")}
                                    >
                                      <Form.Group>
                                        <Form.Control
                                          placeholder='Select Priority Level'
                                          onChange={this.handleChange.bind(
                                            this
                                          )}
                                          as='select'
                                          name='newTaskPriority'
                                        >
                                          <option value='N/A' disabled selected>
                                            Select Priority Level
                                          </option>
                                          <option
                                            value='High'
                                            style={{
                                              color: "#e1651b",
                                              fontWeight: "bold"
                                            }}
                                          >
                                            High Priority
                                          </option>
                                          <option
                                            value='Medium'
                                            style={{
                                              color: "#ffaa0a",
                                              fontWeight: "bold"
                                            }}
                                          >
                                            Medium Priority
                                          </option>
                                          <option
                                            value='Low'
                                            style={{
                                              color: "#2ab009",
                                              fontWeight: "bold"
                                            }}
                                          >
                                            Low Priority
                                          </option>
                                        </Form.Control>
                                      </Form.Group>
                                    </div>
                                    <Card.Text
                                      onClick={() => this.edit("none")}
                                    >
                                      {task.status}
                                    </Card.Text>
                                  </div>
                                ) : isDescriptionClicked ? (
                                  <div>
                                    <h5
                                      className='task-name mx-auto card-title mt-3'
                                      onMouseOver={() =>
                                        this.handleToggleMouseOver(
                                          "newTaskName"
                                        )
                                      }
                                      onClick={() => this.edit("name")}
                                    >
                                      {this.state.newTaskName === "" ? (
                                        <p style={newTaskNameStyle}>
                                          {task.name}
                                        </p>
                                      ) : (
                                        <p style={newTaskNameStyle}>
                                          {this.state.newTaskName}
                                        </p>
                                      )}
                                    </h5>
                                    <div className='card-subtitle mb-1 text-muted'>
                                      <input
                                        text='text'
                                        name='newTaskDescription'
                                        value={this.state.newTaskDescription}
                                        onChange={this.handleChange.bind(this)}
                                      ></input>
                                    </div>
                                    <div
                                      className='card-subtitle mb-1 text-muted'
                                      onClick={() => this.edit("none")}
                                    >
                                      <Form.Group>
                                        <Form.Control
                                          placeholder='Select Priority Level'
                                          onChange={this.handleChange.bind(
                                            this
                                          )}
                                          as='select'
                                          name='newTaskPriority'
                                        >
                                          <option value='N/A' disabled selected>
                                            Select Priority Level
                                          </option>
                                          <option
                                            value='High'
                                            style={{
                                              color: "#e1651b",
                                              fontWeight: "bold"
                                            }}
                                          >
                                            High Priority
                                          </option>
                                          <option
                                            value='Medium'
                                            style={{
                                              color: "#ffaa0a",
                                              fontWeight: "bold"
                                            }}
                                          >
                                            Medium Priority
                                          </option>
                                          <option
                                            value='Low'
                                            style={{
                                              color: "#2ab009",
                                              fontWeight: "bold"
                                            }}
                                          >
                                            Low Priority
                                          </option>
                                        </Form.Control>
                                      </Form.Group>
                                    </div>
                                    <Card.Text
                                      onClick={() => this.edit("none")}
                                    >
                                      {task.status}
                                    </Card.Text>
                                  </div>
                                ) : (
                                  <div>
                                    <h5
                                      className='task-name card-title mt-3'
                                      onMouseOver={() =>
                                        this.handleToggleMouseOver(
                                          "newTaskName"
                                        )
                                      }
                                      onMouseLeave={() =>
                                        this.handleToggleMouseOver(
                                          "newTaskName"
                                        )
                                      }
                                      onClick={() => this.edit("name")}
                                    >
                                      {this.state.newTaskName === "" ? (
                                        <p style={newTaskNameStyle}>
                                          {task.name}
                                        </p>
                                      ) : (
                                        <p style={newTaskNameStyle}>
                                          {this.state.newTaskName}
                                        </p>
                                      )}
                                    </h5>

                                    <div
                                      className='card-subtitle mb-1 text-muted'
                                      onMouseOver={() =>
                                        this.handleToggleMouseOver(
                                          "newTaskDescription"
                                        )
                                      }
                                      onMouseLeave={() =>
                                        this.handleToggleMouseOver(
                                          "newTaskDescription"
                                        )
                                      }
                                      onClick={() => this.edit("description")}
                                    >
                                      {this.state.newTaskDescription === "" ? (
                                        <p style={newTaskDescriptionStyle}>
                                          {task.description}
                                        </p>
                                      ) : (
                                        <p style={newTaskDescriptionStyle}>
                                          {this.state.newTaskDescription}
                                        </p>
                                      )}
                                    </div>
                                    <div
                                      className='card-subtitle mb-1 text-muted'
                                      onClick={() => this.edit("none")}
                                    >
                                      <Form.Group>
                                        <Form.Control
                                          placeholder='Select Priority Level'
                                          onChange={this.handleChange.bind(
                                            this
                                          )}
                                          as='select'
                                          name='newTaskPriority'
                                        >
                                          <option value='N/A' disabled selected>
                                            Select Priority Level
                                          </option>
                                          <option
                                            value='High'
                                            style={{
                                              color: "#e1651b",
                                              fontWeight: "bold"
                                            }}
                                          >
                                            High Priority
                                          </option>
                                          <option
                                            value='Medium'
                                            style={{
                                              color: "#ffaa0a",
                                              fontWeight: "bold"
                                            }}
                                          >
                                            Medium Priority
                                          </option>
                                          <option
                                            value='Low'
                                            style={{
                                              color: "#2ab009",
                                              fontWeight: "bold"
                                            }}
                                          >
                                            Low Priority
                                          </option>
                                        </Form.Control>
                                      </Form.Group>
                                    </div>
                                    <Card.Text
                                      onClick={() => this.edit("none")}
                                    >
                                      {task.status}
                                    </Card.Text>
                                  </div>
                                )}
                                <div className='row'>
                                  <Button
                                    className='task-btn'
                                    onClick={() =>
                                      this.handleCreateTask({ team })
                                    }
                                  >
                                    Create Task
                                  </Button>
                                  <Button
                                    className='task-btn'
                                    onClick={() => this.handleCancelCreation()}
                                  >
                                    Cancel
                                  </Button>
                                  {isError === true ? (
                                    <div className='row'>
                                      <div className='col-lg-12 m-1'>
                                        {this.state.errorMsg}
                                      </div>
                                    </div>
                                  ) : (
                                    <div></div>
                                  )}
                                  <div className='row error'>
                                    {this.setState.errorMsg}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className='col-lg-3 mb-2 px-1'>
                            <div className='task-card card'>
                              <div className='card-body d-flex flex-column over'>
                                <div className='d-flex justify-content-between'>
                                  <span>
                                    <h5 className='task-name card-title mt-3'>
                                      {task.name}
                                    </h5>
                                  </span>
                                  <span className='align-right'>
                                    <a
                                      onClick={() =>
                                        this.handleShowModal(task.id)
                                      }
                                    >
                                      <h5
                                        id={task.id}
                                        onClick={e =>
                                          this.handleDeleteTaskInfo(e)
                                        }
                                        className='delete mt-3'
                                      >
                                        X
                                      </h5>
                                    </a>
                                  </span>
                                </div>

                                <div className='card-subtitle mb-1 text-muted'>
                                  {task.description}
                                </div>
                                <div className='card-subtitle mb-1 text-muted'>
                                  {task.priority}
                                </div>
                                <Card.Text>{task.status}</Card.Text>
                                <div className='row my-auto claim-task'>
                                  <Button
                                    name={task.id}
                                    className='task-btn button50 mx-auto'
                                    onClick={e => {
                                      this.handleClaimTask(e);
                                    }}
                                  >
                                    Claim Task
                                    <i class='pl-2 far fa-plus-square'></i>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    }
                  })}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        <Modal show={this.state.show} onHide={() => this.handleClose()}>
          {/* <Modal.Header closeButton></Modal.Header> */}
          <Modal.Body>
            <div className='container'>
              <h4>Are you sure you want to delete this task?</h4>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className='allocat-danger'
              onClick={() => this.handleDeleteTask(this.state.modalID)}
            >
              Delete Task
            </Button>
            <Button variant='secondary' onClick={() => this.handleHideModal()}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}
