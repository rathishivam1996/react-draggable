import React, { useCallback } from "react";
import {
  type DraggableOptions,
  type DraggableCallback,
  type DraggableCallbackMeta,
  type DraggableReactEvents,
  DraggableEventType,
} from "./use-draggable.type";
import { useDraggable } from "./use-draggable";
import "./use-draggable.test.css";

const Test: React.FC = () => {
  const callback: DraggableCallback<HTMLDivElement, string> = useCallback(
    (
      event: DraggableReactEvents<HTMLDivElement>,
      meta: DraggableCallbackMeta<string>,
    ) => {
      console.log("long pressed");
      console.log(event);
      console.log(meta);
    },
    [],
  );

  const options: DraggableOptions<
    HTMLDivElement,
    string,
    DraggableEventType.Pointer
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
    detect: DraggableEventType.Pointer, // Default option
  };

  const { draggableRef, parentRef, bind } = useDraggable<
    HTMLDivElement,
    string,
    DraggableCallback<HTMLDivElement, string>
  >(callback, options);

  return (
    <div className="parent" ref={parentRef}>
      <div className="draggable" ref={draggableRef} {...bind("context")} />
    </div>
  );
};

export default Test;
