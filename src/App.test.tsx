import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import App from "./App";

it("renders without crashing", () => {
  const csrfMock = jest.spyOn(axios, "get");
  csrfMock.mockReturnValueOnce(
    Promise.resolve({ data: { data: "fake-csrf-token" } })
  );
  const createSessionMock = jest.spyOn(axios, "get");
  createSessionMock.mockReturnValueOnce(
    Promise.resolve({ data: { data: "fake-session" } })
  );

  /* eslint-env browser */
  const div = document.createElement("div");

  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);

  expect(csrfMock).toHaveBeenCalled();
  expect(createSessionMock).toHaveBeenCalled();
  csrfMock.mockRestore();
  createSessionMock.mockRestore();
});
