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
    let loadMsg = document.getElementById("loadMsg");
    let dataBullets = document.getElementById("dataBullets");
    if (this.state.summName === '') {
      loadMsg.innerHTML = "Add a summoner name before submitting!"
      event.preventDefault();
      return
    }
    loadMsg.innerHTML = "loading...";
    let jsonReq = new XMLHttpRequest();
    jsonReq.responseType = "json";
    jsonReq.open("GET", url);
    jsonReq.onreadystatechange = () => {
      if (jsonReq.readyState === XMLHttpRequest.DONE) {
        if (jsonReq.status === 403) {
          loadMsg.innerHTML = "Forbidden - api key likely needs to be updated";
          dataBullets.innerHTML = "";
        } else if (jsonReq.status >= 400) {
          loadMsg.innerHTML = jsonReq.statusText;
          dataBullets.innerHTML = "";
        } else if(jsonReq.status === 0) {
          loadMsg.innerHTML = "Failed with status code 0 - connection to server likely refused";
          dataBullets.innerHTML = "";
        } else {
          let jsonResp = jsonReq.response;
          loadMsg.innerHTML = "";
          dataBullets.innerHTML = "";
          jsonResp.matchData.forEach(x => {
            let roundedX = x;
            if (typeof x === "number") {
              roundedX = x.toFixed(2);
            }
            let listItem = document.createElement("li");
            let innerText = document.createTextNode("" + roundedX);
            listItem.appendChild(innerText);
            dataBullets.appendChild(listItem);
          })
        }
      }
    }
    jsonReq.send();
    event.preventDefault();
  }

  render() {
    return (
      <div id="App">
        <header id="app-header">
          <h1>
            League of Legends KDA Analyzer (work in progress)
          </h1>
          <p>
            Type in your summoner name below and see the KDA difference between you and your lane opponent for the last 10 games.
            Data is pulled from my Node server on Heroku, which chains calls from Riot Games's apis.
            Currently only works for 5v5 summoner's rift games, non-special game modes. Try submitting PVLeviathan as an example.
          </p>
        </header>
        <div id="listArea">
          <form id="formArea" onSubmit={this.handleSubmit}>
            <label id="boxLabel" for="summoner">Summoner Name: </label>
            <input id="summoner" type="text" value={this.state.summName} onChange={this.handleChange}/>
            <input id="submitButton" type="submit" value="Submit"/>
          </form>
          <p id="loadMsg"></p>
          <ul id="dataBullets"></ul>
        </div>
        <footer id="app-footer">
          <a href="https://github.com/sinclair-guthrie/react-winners-queue" target="_blank" rel="noopener noreferrer">
            React source repo
          </a>
          <br />
          <a href="https://github.com/sinclair-guthrie/riot-node-server" target="_blank" rel="noopener noreferrer">
            Node server repo
          </a>
        </footer>
      </div>
    );
  }
}

export default App;
