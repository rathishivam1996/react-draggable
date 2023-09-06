import React from "react";
// import logo from "./logo.svg";
import Test from "./use-long-press/use-long-press.test";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="container">
      <Test />
      <div className="extra"></div>
    </div>
  );
};

export default App;
