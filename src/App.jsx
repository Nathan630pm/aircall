import { call } from "function-bind";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import regeneratorRuntime from "regenerator-runtime";

import IncomingCall from "./assets/incomming-call.png";
import OutgoingCall from "./assets/outgoing-call.png";
import MissedCall from "./assets/missed-call.png";
import VoiceMail from "./assets/voicemail.png";

import Info from "./assets/info.png";
import Close from "./assets/close.png";

import Header from "./Header.jsx";

const App = () => {
  const [tab, setTab] = useState(0);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [callDetails, setCallDetails] = useState({});

  const [callList, setCallList] = useState([]);
  const [archivedList, setArchivedList] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch("https://aircall-job.herokuapp.com/activities")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          sortResults(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const sortResults = (result) => {
    console.log(result);
    let tempList = [];
    let tempArchivedList = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i].is_archived) {
        tempArchivedList.push(result[i]);
      } else {
        tempList.push(result[i]);
      }
    }
    setCallList([...tempList]);
    setArchivedList([...tempArchivedList]);
  };

  const getDetails = (id) => {
    setCallDetails({});
    fetch("https://aircall-job.herokuapp.com/activities/" + id)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCallDetails(result);
          setModalOpen(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const postData = async (id, isArchived)  => {
    console.log('id:' + id)
    const jsonData = {
      is_archived: !isArchived
    };
    let response = await fetch("https://aircall-job.herokuapp.com/activities/" + id, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        "x-rapidapi-host": "fairestdb.p.rapidapi.com",
        "x-rapidapi-key": "apikey",
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify(jsonData)
    });
    // var request = new XMLHttpRequest();
    // request.open("POST", "https://aircall-job.herokuapp.com/activities/" + id, true);
    // request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    // request.send(jsonData);
    // console.log("res:" + JSON.stringify(response))
    getData();
    setModalOpen(false);
  };

  const changeTab = (tab) => {
    console.log("tab: " + tab);
    setTab(tab);
  };

  const getTime = (time) => {
    const date = new Date(time);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    const newdate = months[month] + " " + day + " " + year;
    return newdate;
  };

  const convertSecs = (sec) => {
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
    let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + " hours, " + minutes + " minutes, " + seconds + " seconds.";
  };

  return (
    <div className="container">
      <Header />
      <div id="modal" className={modalOpen ? "modalOpen" : "modalClosed"}>
        <div className="modalContent">
          <div className="closeBtn">
            <a href="#" onClick={() => setModalOpen(false)}>
              <img src={Close} className="CloseImg" />
            </a>
          </div>
          <div className="modalInfo">
            <div className="callNumber">
              {callDetails.direction == "outbound"
                ? "Call to: " + callDetails.to
                : "Call from: " + callDetails.from}
            </div>
            <div className="modalItems">{getTime(callDetails.created_at)}</div>
            <div className="modalItems">Call Type: {callDetails.call_type}</div>
            <div className="modalItems">Called via: {callDetails.via}</div>
            <div className="modalItems">
              Call Time: {convertSecs(callDetails.duration)}
            </div>
          </div>
          <div className="archiveBtn">
            <a
              href="#"
              onClick={() => postData(callDetails.id, callDetails.is_archived)}
            >
              <div className="archiveCallText">
                {callDetails.is_archived ? "Unarchive" : "Archive"}
              </div>
            </a>
          </div>
        </div>
      </div>
      {!isLoaded ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="container-view">
          <div className="topMenu">
            <a
              className={tab == 0 ? "menuItem selected" : "menuItem"}
              href="#"
              onClick={() => changeTab(0)}
            >
              Activity Feed
            </a>
            <a
              className={tab == 1 ? "menuItem selected" : "menuItem"}
              href="#"
              onClick={() => changeTab(1)}
            >
              Archived
            </a>
          </div>
          {tab == 0 ? (
            <div>
              {callList.map((call, index) => (
                <div className="call" key={`call-${index}-id-${call.id}`}>
                  <div className="callItem callLeft">
                    <div className="callItemDetail">
                      <img
                        className="icons"
                        src={
                          call.direction == "outbound"
                            ? OutgoingCall
                            : call.call_type == "answered"
                            ? IncomingCall
                            : call.call_type == "missed"
                            ? MissedCall
                            : call.call_type == "voicemail"
                            ? VoiceMail
                            : null
                        }
                      />
                    </div>
                  </div>
                  <div className="callItem callCenter">
                    <div className="callItemDetail">
                      <div className="callDetails">
                        <div className="callNumber">
                          {call.direction == "outbound" ? call.to : call.from}
                        </div>
                        <div>{getTime(call.created_at)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="callItem callRight">
                    <div className="callItemDetail">
                      <a href="#" onClick={() => getDetails(call.id)}>
                        <img className="icons" src={Info} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {archivedList.map((call, index) => (
                <div className="call" key={`call-${index}-id-${call.id}`}>
                  <div className="callItem callLeft">
                    <div className="callItemDetail">
                      <img
                        className="icons"
                        src={
                          call.direction == "outbound"
                            ? OutgoingCall
                            : call.call_type == "answered"
                            ? IncomingCall
                            : call.call_type == "missed"
                            ? MissedCall
                            : call.call_type == "voicemail"
                            ? VoiceMail
                            : null
                        }
                      />
                    </div>
                  </div>
                  <div className="callItem callCenter">
                    <div className="callItemDetail">
                      <div className="callDetails">
                        <div className="callNumber">
                          {call.direction == "outbound" ? call.to : call.from}
                        </div>
                        <div>{getTime(call.created_at)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="callItem callRight">
                    <div className="callItemDetail">
                      <a href="#" onClick={() => getDetails(call.id)}>
                        <img className="icons" src={Info} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
