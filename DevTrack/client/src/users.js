import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './style.css';
import './bootstrap.css';

let count = 1;

const Callapi1 = (props) => {
    const [task, setTask] = useState("");
    const search = useLocation().search;
    global.username = new URLSearchParams(search).get('username');
    useEffect(() => {
        fetch("http://localhost:9000/users?username=" + global.username)
            .then(res => res.text())
            .then(res => setTask(res));
    }, [global.username]);

    const length = task.length;
    var text1;

    if (length !== 0) {
        text1 = task.split('\n').map(str => (
            <p>
                {str}
                <div style={{ display: "inline-block" }}>
                    <form action="http://localhost:9000/deletetask" method="post">
                        <button className="btn btn-danger" type="submit">Delete</button>
                        <input type="hidden" name="task" value={str}></input>
                        <input type="hidden" name="username" value={global.username}></input>
                    </form>
                </div>
            </p>
        ));
    } else {
        text1 = "NO TASKS AVAILABLE";
    }

    return <>{text1}</>;
};

const Getusername = () => {
    const search = useLocation().search;
    var username = new URLSearchParams(search).get('username');
    global.username = username;
    return (
        <>
            <input className="hidden" type="text" name="username" value={global.username} readOnly />
        </>
    );
};

const Getusername1 = () => {
    const search = useLocation().search;
    var username = new URLSearchParams(search).get('username');
    global.username = username;
    return username;
};

class Users extends React.Component {
  handleFormSubmit = (e) => {
      const taskInput = document.querySelector("input[name='newtask']");
      const dateInput = document.querySelector("input[name='compdate']");
      const maxTaskLength = 255; // Set maximum allowed characters for the task

      if (!taskInput.value.trim()) {
          alert("Please fill in the task.");
          e.preventDefault();
          return;
      }

      if (taskInput.value.length > maxTaskLength) {
          alert(`Task is too long. Please keep it under ${maxTaskLength} characters.`);
          e.preventDefault();
          return;
      }

      if (!dateInput.value) {
          alert("Please select a completion date.");
          e.preventDefault();
          return;
      }
  };

  render() {
      return (
          <>
              <div className="container-fluid bg-primary text-white">
                  <h1 className="head">DevTrack: List of Task</h1>
                  <h2 className="head">User: {<Getusername1 />}</h2>
                  <div style={{ display: "inline-block", marginLeft: "80%" }}>
                      <a href="http://localhost:3000" className="btn btn-danger">Logout</a>
                  </div>
                  <hr />
              </div>
              <div className="taskdiv">
                  <h3 className="tasks"><Callapi1 /></h3>
              </div>
              <div style={{ float: "center" }}>
                  <form
                      action="http://localhost:9000/createtask"
                      method="POST"
                      className="form-group"
                      onSubmit={this.handleFormSubmit}
                  >
                      <br />
                      <div className="addtask_div">
                          <h5>Add new task:</h5>
                          <input type="text" className="form-control-lg" name="newtask" />
                          <h5>Completion Date:</h5>
                          <input type="date" name="compdate" id="compdate"></input>
                          <button style={{ marginLeft: "2%" }} type="submit" className="btn btn-primary">ADD</button>
                      </div>
                      <h1>{<Getusername />}</h1>
                  </form>
              </div>
          </>
      );
  }
}

export default Users;
