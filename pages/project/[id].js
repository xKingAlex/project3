import "../../styles.scss";
import Nav from "../../components/Nav/index";
import MobileDashNav from "../../components/MobileDashNav";
import React, { Component } from "react";
import { ListGroup, Button } from "react-bootstrap";
import Layout from "../../components/Layout";
import axios from "axios";
import DashboardWindow from "../../components/DashboardWindow";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTitle: "",
      menuItems: [
        { title: " Your Projects", link: "/projects", id: 1 },
        { title: "Create a New Project", link: "/newProject", id: 2 },
        { title: "Notifications", link: "/notifications", id: 3 }
      ],
      categorySelected: "",
      teamNames: [],
      teamMembers: [],
      tasks: [],
      timeline: [],
      projectId: 0
    };
  }

  componentDidMount() {
    var url = window.location.href;
    var splitUrl = url.split("/")[4];

    this.setState({
      projectId: splitUrl
    });

    axios.get(`/api/project/${splitUrl}`).then(response => {
      this.setState({
        pageTitle: response.data.projectName
      });
    });

    axios.get(`/api/allTeams/${splitUrl}`).then(response => {
      var newArr = [];

      for (var i = 0; i < response.data.length; i++) {
        newArr.push(response.data[i]);
      }

      this.setState({
        teamNames: newArr
      });
    });
  }

  updateCategory = categoryName => {
    this.setState({ categorySelected: categoryName });
  };

  render() {
    return (
      <div>
        <Layout>
          <Nav
            pageTitle={this.state.pageTitle}
            menuItems={this.state.menuItems}
          />
          <MobileDashNav updateCategory={this.updateCategory} />
          <div class='row'>
            <div className='col-lg-2 float-left my-auto'>
              <ListGroup className='verticle-align pointer'>
                <ListGroup.Item>
                  <a
                    className='task-nav-btn mx-auto'
                    onClick={() => this.updateCategory("teams")}
                  >
                    Teams
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a
                    className='task-nav-btn'
                    onClick={() => this.updateCategory("tasks")}
                  >
                    Tasks
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a
                    className='task-nav-btn'
                    onClick={() => this.updateCategory("timeline")}
                  >
                    Timeline
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </div>
            <div className='col-lg-10 container-main-task float-right px-5'>
              <div className='pt-4'>
                <div className='row'>
                  <div className='col-12'>
                    <h1 className='task-header'>
                      {this.state.categorySelected}
                    </h1>
                  </div>
                  <hr />
                </div>
                <DashboardWindow
                  categorySelected={this.state.categorySelected}
                  tasks={this.state.tasks}
                  teams={this.state.teams}
                  timeline={this.state.timeline}
                />
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}
