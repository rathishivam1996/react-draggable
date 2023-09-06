/* eslint-disable no-console */
import React, { useCallback } from "react";
import "./use-long-press.test.css";
import { useLongPress } from "./use-long-press";
import {
  type LongPressReactEvents,
  type LongPressCallback,
  type LongPressCallbackMeta,
  type LongPressOptions,
  LongPressEventType,
} from "./use-long-press.types";

const Test: React.FC = () => {
  const callback: LongPressCallback<HTMLDivElement, string> = useCallback(
    (
      event: LongPressReactEvents<HTMLDivElement>,
      meta: LongPressCallbackMeta<string>,
    ) => {
      console.log("long pressed");
      console.log(event);
      console.log(meta);
    },
    [],
  );

  const options: LongPressOptions<
    HTMLDivElement,
    string,
    LongPressEventType.Pointer
  > = {
    onStart: (event) => {
      console.log("Press started");
    },
    onFinish: (event) => {
      console.log("Long press finished");
    },
    onCancel: (event) => {
      console.log("Press cancelled");
    },
    onMove: (event) => {
      console.log("Detected mouse or touch movement");
    },
    filterEvents: (event) => true, // All events can potentially trigger long press (same as 'undefined')
    threshold: 500, // In milliseconds
    captureEvent: true, // Event won't get cleared after React finish processing it
    cancelOnMovement: 25, // Square side size (in pixels) inside which movement won't cancel long press
    cancelOutsideElement: true, // Cancel long press when moved mouse / pointer outside element while pressing
    detect: LongPressEventType.Pointer, // Default option
  };

  const bind = useLongPress<
    HTMLDivElement,
    string,
    LongPressCallback<HTMLDivElement, string>
  >(callback, options);

  return <div className="test-div" {...bind("context")}></div>;
};

export default Test;
