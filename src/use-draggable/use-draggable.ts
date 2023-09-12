import {
  type MouseEventHandler,
  type PointerEventHandler,
  type TouchEventHandler,
  useState,
  useCallback,
} from "react";
import {
  DraggableEventType,
  type DraggableCallback,
  type DraggableOptions,
  type DraggableResult,
  type DraggableReactEvents,
  type DraggableHandlers,
  type DraggableBinder,
} from "./use-draggable.type";

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
    cancelOnMovement = false,
    cancelOutsideElement = true,
    filterEvents,
    onStart,
    onMove,
    onFinish,
    onCancel,
  }: DraggableOptions<Target, Context> = {},
): DraggableResult<
  DraggableBinder<DraggableHandlers<Target>, Context>,
  Target
> {
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
    (context?: Context) => (event: DraggableReactEvents<Target>) => {
      console.log(`start called!!!`);
    },
    [],
  );

  const cancel = useCallback(
    (context?: Context) => (event: DraggableReactEvents<Target>) => {
      console.log(`cancel called!!!`);
    },
    [],
  );

  const move = useCallback(
    (context?: Context) => (event: DraggableReactEvents<Target>) => {
      console.log(`move called!!!`);
    },
    [],
  );

  const bind = useCallback<DraggableBinder<DraggableHandlers<Target>, Context>>(
    (ctx?: Context) => {
      if (callback === null) {
        return {};
      }

      switch (detect) {
        case DraggableEventType.Mouse: {
          return {
            onMouseDown: start(ctx) as MouseEventHandler<Target>,
            onMouseMove: move(ctx) as MouseEventHandler<Target>,
            onMouseUp: cancel(ctx) as MouseEventHandler<Target>,
          };
        }
        case DraggableEventType.Touch: {
          return {
            onTouchStart: start(ctx) as TouchEventHandler<Target>,
            onTouchMove: move(ctx) as TouchEventHandler<Target>,
            onTouchEnd: cancel(ctx) as TouchEventHandler<Target>,
          };
        }
        case DraggableEventType.Pointer: {
          return {
            onPointerDown: start(ctx) as PointerEventHandler<Target>,
            onPointerMove: move(ctx) as PointerEventHandler<Target>,
            onPointerUp: cancel(ctx) as PointerEventHandler<Target>,
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
