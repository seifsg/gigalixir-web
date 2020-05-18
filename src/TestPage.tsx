import React, { Component } from "react";
import { render } from "react-dom";

import { Line } from "react-chartjs-2";
import * as zoom from "chartjs-plugin-zoom";
import Hammer from "hammerjs";
import Chart from './Chart'

const sampleData = [
  { x: 1000000, y: 1 },
  { x: 2000000, y: 1 },
  { x: 3000000, y: 1 },
  { x: 4000000, y: 1 },
  { x: 5000000, y: 1 },
  { x: 6000000, y: 1 },
  { x: 7000000, y: 1 },
  { x: 8000000, y: 1 },
  { x: 9000000, y: 1 },
  { x: 10000000, y: 1 },
  { x: 11000000, y: 1 },
  { x: 12000000, y: 1 },
  { x: 13000000, y: 1 },
  { x: 14000000, y: 1 },
  { x: 15000000, y: 1 },
  { x: 16000000, y: 1 },
  { x: 17000000, y: 1 },
  { x: 18000000, y: 1 },
  { x: 19000000, y: 1 },
  { x: 20000000, y: 1 },
  { x: 21000000, y: 1 },
  { x: 22000000, y: 1 }
];

const initialDataOptions = {
  datasets: [{
    data: sampleData
  }]
};

const initialOptions = {
  scales: {
    xAxes: [
      {
        type: "time"
      }
    ],
  },
  pan: {
    enabled: true,
    mode: "x"
  },
  zoom: {
    enabled: true,
    mode: "x"
  }
};

class App extends Component {
  render() {
    return <Chart data={initialDataOptions.datasets[0].data} title="Hi"/>;
  }
}

render(<App />, document.getElementById("root"));

export default App
