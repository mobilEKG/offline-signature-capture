
/* eslint-disable @typescript-eslint/no-unused-vars */
// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";  // Tailwind base and utilities imported here

const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
