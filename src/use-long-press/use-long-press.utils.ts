import type {
  LongPressDomEvents,
  LongPressReactEvents,
} from "./use-long-press.types";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  SyntheticEvent,
  TouchEvent as ReactTouchEvent,
} from "react";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getPointerEvent = () =>
  typeof window === "object" ? window?.PointerEvent ?? null : null;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getTouchEvent = () =>
  typeof window === "object" ? window?.TouchEvent ?? null : null;

export function isTouchEvent<Target extends Element>(
  event: SyntheticEvent<Target>,
): event is ReactTouchEvent<Target> {
  const { nativeEvent } = event;
  const TouchEvent = getTouchEvent();

  return (
    (TouchEvent != null && nativeEvent instanceof TouchEvent) ||
    "touches" in event
  );
}

export function isMouseEvent<Target extends Element>(
  event: SyntheticEvent<Target>,
): event is ReactMouseEvent<Target> {
  const PointerEvent = getPointerEvent();
  return (
    event.nativeEvent instanceof MouseEvent &&
    !(PointerEvent != null && event.nativeEvent instanceof PointerEvent)
  );
}

export function isPointerEvent<Target extends Element>(
  event: SyntheticEvent<Target>,
): event is ReactPointerEvent<Target> {
  const { nativeEvent } = event;
  if (nativeEvent === null || nativeEvent === undefined) {
    return false;
  }

  const PointerEvent = getPointerEvent();
  return (
    (PointerEvent != null && nativeEvent instanceof PointerEvent) ||
    "pointerId" in nativeEvent
  );
}

export function isRecognisableEvent<Target extends Element>(
  event: SyntheticEvent<Target>,
): event is LongPressReactEvents<Target> {
  return isMouseEvent(event) || isTouchEvent(event) || isPointerEvent(event);
}

export function getCurrentPosition<Target extends Element>(
  event: LongPressReactEvents<Target>,
): {
  x: number;
  y: number;
} | null {
  if (isTouchEvent(event)) {
    return {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    };
  }

  if (isMouseEvent(event) || isPointerEvent(event)) {
    return {
      x: event.pageX,
      y: event.pageY,
    };
  }

  return null;
}

export function createArtificialReactEvent<Target extends Element = Element>(
  event: LongPressDomEvents,
): LongPressReactEvents<Target> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {
    target: event.target,
    currentTarget: event.currentTarget,
    nativeEvent: event,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    persist: () => {},
  } as LongPressReactEvents<Target>;
}
