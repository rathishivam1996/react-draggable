import type {
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  PointerEvent as ReactPointerEvent,
  PointerEventHandler,
  TouchEvent as ReactTouchEvent,
  TouchEventHandler,
} from "react";

// export interface DraggableResult<Target> {
//   draggableRef: (node: Target) => void;
//   parentRef: (node: Target) => void;
// }

export enum DraggableEventType {
  Mouse = "mouse",
  Touch = "touch",
  Pointer = "pointer",
}

export enum DraggableCallbackReason {
  CancelledByMovement = "cancelled-by-movement",
  CancelledByRelease = "cancelled-by-release",
  CancelledOutsideElement = "cancelled-outside-element",
}

export type DraggableCallback<
  Target extends Element = Element,
  Context = unknown,
> = (
  event: DraggableReactEvents<Target>,
  meta: DraggableCallbackMeta<Context>,
) => void;

export type DraggableDomEvents = MouseEvent | TouchEvent | PointerEvent;

export type DraggableReactEvents<Target extends Element = Element> =
  | ReactMouseEvent<Target>
  | ReactTouchEvent<Target>
  | ReactPointerEvent<Target>;

export interface DraggableCallbackMeta<Context = unknown> {
  context?: Context;
  reason?: DraggableCallbackReason;
}

export interface DraggableOptions<
  Target extends Element = Element,
  Context = unknown,
  EventType extends DraggableEventType = DraggableEventType,
> {
  doubleTapped: boolean;
  threshold?: number;
  captureEvent?: boolean;
  detect?: EventType;
  filterEvents?: (event: DraggableReactEvents<Target>) => boolean;
  // cancelOnMovement?: boolean | number;
  cancelOutsideElement?: boolean;
  onStart?: DraggableCallback<Target, Context>;
  onMove?: DraggableCallback<Target, Context>;
  onFinish?: DraggableCallback<Target, Context>;
  onCancel?: DraggableCallback<Target, Context>;
}

export interface TestReturn<Target extends Element = Element> {
  draggableRef: (node: Target) => void;
  parentRef: (node: Target) => void;
}

export type DraggableBinder<
  T extends DraggableHandlers<Target> | DraggableEmptyHandlers,
  Context = unknown,
  Target extends Element = Element,
> = (context?: Context) => T;

export interface DraggableResult<
  DraggableBinder,
  Target extends Element = Element,
> {
  draggableRef: (node: Target) => void;
  parentRef: (node: Target) => void;
  bind: DraggableBinder;
}

export type DraggableEmptyHandlers = Record<never, never>;

export interface DraggableMouseHandlers<Target extends Element = Element> {
  onMouseDown: MouseEventHandler<Target>;
  onMouseMove: MouseEventHandler<Target>;
  onMouseUp: MouseEventHandler<Target>;
  onMouseLeave?: MouseEventHandler<Target>;
}
export interface DraggableTouchHandlers<Target extends Element = Element> {
  onTouchStart: TouchEventHandler<Target>;
  onTouchMove: TouchEventHandler<Target>;
  onTouchEnd: TouchEventHandler<Target>;
}
export interface DraggablePointerHandlers<Target extends Element = Element> {
  onPointerDown: PointerEventHandler<Target>;
  onPointerMove: PointerEventHandler<Target>;
  onPointerUp: PointerEventHandler<Target>;
  onPointerLeave?: PointerEventHandler<Target>;
}

export type DraggableHandlers<Target extends Element = Element> =
  | DraggableMouseHandlers<Target>
  | DraggableTouchHandlers<Target>
  | DraggablePointerHandlers<Target>
  | DraggableEmptyHandlers;

export type DraggableWindowListener = (event: DraggableDomEvents) => void;
