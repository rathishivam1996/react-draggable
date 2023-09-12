/* eslint-disable no-console */
import React from "react";
import "./use-measurable.test.css";
import useMeasureNode from "./use-measurable";
import type { MeasureNodeResult } from "./use-measurable.types";

const Test: React.FC = () => {
  const { measuredRef, height }: MeasureNodeResult<HTMLDivElement> =
    useMeasureNode();
  return (
    <div className="parent">
      <div className="draggable" ref={measuredRef}>
        {height}
      </div>
    </div>
  );
};

export default Test;
