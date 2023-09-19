/* eslint-disable no-console */
import React, { type MouseEvent, useCallback } from "react";
import "./use-double-tap.test.css";
import {
  type DoubleTapOptions,
  type DoubleTapCallback,
} from "./use-double-tap.types";
import { useDoubleTap } from "./use-double-tap";

const Test: React.FC = () => {
  const callback: DoubleTapCallback<HTMLDivElement> = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      console.log(`double tapped with event`);
    },
    [],
  );

  const options: DoubleTapOptions<HTMLDivElement> = {
    onSingleTap: (event) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      console.log(`single tapped with event`);
    },
  };

  const bind = useDoubleTap<HTMLDivElement, DoubleTapCallback<HTMLDivElement>>(
    callback,
    300,
    options,
  );

  return <div className="test-div" {...bind}></div>;
};

export default Test;
