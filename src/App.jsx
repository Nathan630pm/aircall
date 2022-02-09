import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import Header from "./Header.jsx";

const App = () => {
  const [callData, setCallData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [callDetails, setCallDetails] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch("https://aircall-job.herokuapp.com/activities")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCallData(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const getInfo = (id) => {
    setCallDetails({});
    fetch("https://aircall-job.herokuapp.com/activities/:" + id)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCallData(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const postData = (id, isArchived) => {
    fetch("https://aircall-job.herokuapp.com/activities/:" + id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: {
        is_archived: isArchived,
      },
    });
  };

  return (
    <div className="container">
      <Header />
      {!isLoaded ? (
        <div className="container-view">Loading...</div>
      ) : (
        <div className="container-view">
          {callData.map((call, index) => (
            <div key={`call-${index}`}>test - {index}</div>
          ))}
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
