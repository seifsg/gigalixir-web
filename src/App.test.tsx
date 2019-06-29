import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as axios from "axios";

jest.mock("axios");

it('renders without crashing', () => {
  axios.get.mockImplementation((url: string) => {
    if (url.includes("/frontend/api/csrf")) {
      Promise.resolve({ data: "fake-csrf-token" })
    }
  });
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
