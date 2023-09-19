import React from "react";
// import logo from "./logo.svg";
// import Test from "./use-long-press/use-long-press.test";
// import Test from "./use-measurable/use-measurable.test";
import Test from "./use-draggable/use-draggable.test";
// import Test from "./use-draggable-1/use-double-tap.test";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="container">
      <Test />
      <div className="extra">extra</div>
    </div>
  );
};

export default App;
