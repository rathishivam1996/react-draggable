import {
  type MouseEventHandler,
  type PointerEventHandler,
  type TouchEventHandler,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  DraggableEventType,
  type DraggableCallback,
  type DraggableOptions,
  type DraggableResult,
  type DraggableReactEvents,
  type DraggableHandlers,
  type DraggableBinder,
  DraggableCallbackReason,
} from "./use-draggable.type";
import { getCurrentPosition, isRecognisableEvent } from "./utils/dom-utils";

export function useDraggable<
  Target extends Element = Element,
  Context = unknown,
  Callback extends DraggableCallback<Target, Context> = DraggableCallback<
    Target,
    Context
  >,
>(
  callback: Callback | null,
  {
    threshold = 400,
    captureEvent = false,
    detect = DraggableEventType.Pointer,
    cancelOutsideElement = true,
    doubleTapped,
    filterEvents,
    onStart,
    onMove,
    onFinish,
    onCancel,
  }: DraggableOptions<Target, Context> = { doubleTapped: false },
): DraggableResult<
  DraggableBinder<DraggableHandlers<Target>, Context>,
  Target
> {
  const isLongPressActive = useRef(false);
  const isPressed = useRef(false);
  const target = useRef<Target>();
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [isDragActive, setIsDragActive] = useState(false);
  const startPosition = useRef<{
    x: number;
    y: number;
  } | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [draggable, setDraggable] = useState<Target | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [parent, setParent] = useState<Target | undefined>(undefined);
  const draggableRef = useCallback((node: Target) => {
    if (node !== undefined) setDraggable(node);
  }, []);

  const parentRef = useCallback((node: Target) => {
    if (node !== undefined) setParent(node);
  }, []);

  const start = useCallback(
    (context?: any) => (event: DraggableReactEvents<Target>) => {
      console.log(`start called!!! with ctx ${context}`);
      if (doubleTapped) {
        console.log(".................................................");
      }
      // Prevent multiple start triggers
      if (isPressed.current) {
        return;
      }

      // Ignore unrecognised events
      if (!isRecognisableEvent(event)) {
        return;
      }

      // If we don't want all events to trigger long press and provided event is filtered out
      if (filterEvents !== undefined && !filterEvents(event)) {
        return;
      }

      if (captureEvent) {
        event.persist();
      }

      // When touched trigger onStart and start timer
      // onStart?.(event, { context });

      // Calculate position after calling 'onStart' so it can potentially change it
      startPosition.current = getCurrentPosition(event);
      isPressed.current = true;
      target.current = event.currentTarget;

      timer.current = setTimeout(() => {
        isLongPressActive.current = true;
      }, threshold);
    },
    [captureEvent, filterEvents, onStart, threshold, doubleTapped],
  );

  const cancel = useCallback(
    (context?: any) =>
      (
        event: DraggableReactEvents<Target>,
        reason?: DraggableCallbackReason,
      ) => {
        console.log(`cancel called!!! with ctx ${context}`);
        // Ignore unrecognised events
        if (!isRecognisableEvent(event)) {
          return;
        }
        // Ignore when element is not pressed anymore
        if (!isPressed.current) {
          return;
        }
        if (captureEvent) {
          event.persist();
        }

        startPosition.current = null;

        // Trigger onFinish callback only if timer was active
        if (isLongPressActive.current) {
          setIsDragActive(true);
          onFinish?.(event, { context });
        } else if (isPressed.current) {
          // If not active but pressed, trigger onCancel
          onCancel?.(event, {
            context,
            reason: reason ?? DraggableCallbackReason.CancelledByRelease,
          });
        }

        isLongPressActive.current = false;
        isPressed.current = false;
        timer.current !== undefined && clearTimeout(timer.current);
      },
    [captureEvent, onFinish, onCancel],
  );

  const move = useCallback(
    (context?: any) => (event: DraggableReactEvents<Target>) => {
      console.log(`move called!!! with ctx ${context}`);
      if (isDragActive) {
        console.log(`draggable active`);
      }
    },
    [cancel, onMove, isDragActive],
  );

  const bind = useCallback<DraggableBinder<DraggableHandlers<Target>, Context>>(
    (ctx?: Context) => {
      if (callback === null) {
        return {};
      }

      switch (detect) {
        case DraggableEventType.Mouse: {
          return {
            onMouseDown: start("mouse") as MouseEventHandler<Target>,
            onMouseMove: move("mouse") as MouseEventHandler<Target>,
            onMouseUp: cancel("mouse") as MouseEventHandler<Target>,
          };
        }
        case DraggableEventType.Touch: {
          return {
            onTouchStart: start("touch") as TouchEventHandler<Target>,
            onTouchMove: move("touch") as TouchEventHandler<Target>,
            onTouchEnd: cancel("touch") as TouchEventHandler<Target>,
          };
        }
        case DraggableEventType.Pointer: {
          return {
            onPointerDown: start("ptr") as PointerEventHandler<Target>,
            onPointerMove: move("ptr") as PointerEventHandler<Target>,
            onPointerUp: cancel("ptr") as PointerEventHandler<Target>,
          };
        }
      }
    },
    [],
  );

  return {
    draggableRef,
    parentRef,
    bind,
  };
}

// const onDraggableClick = (e: any): void => {
//   console.log(`Draggable clicked !!!`);
// };

// const onParentClick = (e: any): void => {
//   console.log(`Parent clicked !!!`);
// };

// useEffect(() => {
//   if (draggable !== undefined) {
//     draggable.addEventListener("click", onDraggableClick);
//     return () => {
//       draggable.removeEventListener("click", onDraggableClick);
//     };
//   }
// }, [draggable]);

// useEffect(() => {
//   if (parent !== undefined) {
//     parent.addEventListener("click", onParentClick);
//     return () => {
//       parent.removeEventListener("click", onDraggableClick);
//     };
//   }
// }, [parent]);
