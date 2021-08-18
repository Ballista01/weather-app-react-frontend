import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [state, setState] = useState({
    serverHelloMsg: "initializing...",
    weather: { city: "", weatherStr: "", updated: false },
  });

  async function getServerJson(dir) {
    const response = await fetch(dir);
    // console.log(response);
    const body = await response.json();
    console.log(body);

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return await body;

    // fetch(dir).then(res => res.json()).then(body)
  }

  useEffect(() => {
    async function updateHelloMsg() {
      const body = await getServerJson("/hello");
      setState((state) => {
        const newState = { ...state, serverHelloMsg: body.helloMsg };
        return newState;
      });
      // getServerJson("/hello").then((body) =>
      //   setState({ serverHelloMsg: body.helloMsg })
      // );
    }
    async function updateWeatherInfo() {
      async function success(pos) {
        console.log("User Geolocation Attained!");
        const body = await getServerJson(
          `/weather/api/coords?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
        );
        if (body.current.condition.text === undefined) {
          setState((state) => {
            const newState = {
              ...state,
              weather: {
                city: "N/A",
                weatherStr: "N/A",
              },
            };
            return newState;
          });
        } else {
          setState((state) => {
            const newState = {
              ...state,
              weather: {
                ...state.weather,
                city: body.location.name,
                region: body.location.region,
                country: body.location.country,
                weatherStr: body.current.condition.text,
                tempC: body.current.temp_c,
                tempF: body.current.temp_f,
                updated: true,
              },
            };
            return newState;
          });
        }
      }
      function fail(err) {
        console.error(err);
      }
      navigator.geolocation.getCurrentPosition(success, fail);
    }
    updateHelloMsg();
    updateWeatherInfo();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>Hello msg:{state.serverHelloMsg}</p>
        <p>
          Region: {state.weather.region || ""} City: {state.weather.city || ""},
          Weather: {state.weather.weatherStr}, Temp:{" "}
          {state.weather.tempC + " Celsus" || ""}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
