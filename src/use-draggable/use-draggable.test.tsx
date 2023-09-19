import React, { useCallback, type MouseEvent, useState } from "react";
import {
  type DoubleTapCallback,
  type DoubleTapOptions,
} from "../use-double-tap/use-double-tap.types";
import { useDoubleTap } from "../use-double-tap/use-double-tap";
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
  const [doubleTapped, setDoubleTapped] = useState(false);
  const doubleTapCallback: DoubleTapCallback<HTMLDivElement> = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      console.log(`double tapped with event`);
      setDoubleTapped(true);
    },
    [],
  );

  const doubleTapOptions: DoubleTapOptions<HTMLDivElement> = {
    onSingleTap: (event) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      console.log(`single tapped with event`);
    },
  };

  const doubleTapBinder = useDoubleTap<
    HTMLDivElement,
    DoubleTapCallback<HTMLDivElement>
  >(doubleTapCallback, 300, doubleTapOptions);

  const draggableCallback: DraggableCallback<HTMLDivElement, string> =
    useCallback(
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

  const draggableOptions: DraggableOptions<
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
    doubleTapped,
    filterEvents: (event) => true, // All events can potentially trigger long press (same as 'undefined')
    threshold: 500, // In milliseconds
    captureEvent: true, // Event won't get cleared after React finish processing it
    // cancelOnMovement: 25, // Square side size (in pixels) inside which movement won't cancel long press
    cancelOutsideElement: true, // Cancel long press when moved mouse / pointer outside element while pressing
    detect: DraggableEventType.Pointer, // Default option
  };

  const {
    draggableRef,
    parentRef,
    bind: draggableBinder,
  } = useDraggable<
    HTMLDivElement,
    string,
    DraggableCallback<HTMLDivElement, string>
  >(draggableCallback, draggableOptions);

  return (
    <div className="parent" ref={parentRef}>
      <div
        className="draggable"
        ref={draggableRef}
        {...draggableBinder("context")}
        {...doubleTapBinder}
      />
    </div>
  );
};

export default Test;
