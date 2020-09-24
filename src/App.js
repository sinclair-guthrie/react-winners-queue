import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summName: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ summName: event.target.value })
  }

  handleSubmit(event) {
    let url = "https://winners-queue-api.herokuapp.com/request/" + this.state.summName;
    let listDiv = document.getElementById("listArea");
    if (this.state.summName === '') {
      listDiv.innerHTML = "Add a summoner name before submitting!"
      event.preventDefault();
      return
    }
    listDiv.innerHTML = "loading";
    let jsonReq = new XMLHttpRequest();
    jsonReq.responseType = "json";
    jsonReq.open("GET", url);
    jsonReq.onreadystatechange = () => {
      if (jsonReq.readyState === XMLHttpRequest.DONE) {
        if (jsonReq.status >= 400) {
          listDiv.innerHTML = jsonReq.statusText;
        } else if(jsonReq.status === 0) {
          listDiv.innerHTML = "failed with status code 0 - connection to server likely refused"
        } else {
          console.log(jsonReq.response);
          let jsonResp = jsonReq.response;
          listDiv.innerHTML = "";
          let newList = document.createElement("ul");
          jsonResp.matchData.forEach(x => {
            let listItem = document.createElement("li");
            let innerText = document.createTextNode("" + x);
            listItem.appendChild(innerText);
            newList.appendChild(listItem);
          })
          listDiv.appendChild(newList);
        }
      }
    }
    jsonReq.send();
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>
            Are you in winner's or loser's queue?
          </h1>
          <form onSubmit={this.handleSubmit}>
            <label>
              Summoner Name:
          <input type="text" value={this.state.summName} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <div id="listArea">
          </div>
        </header>
      </div>
    );
  }
}

export default App;
