import { type MouseEvent, useCallback, useRef } from "react";
import {
  type CallbackFunction,
  type DoubleTapCallback,
  type DoubleTapOptions,
  type DoubleTapResult,
} from "./use-double-tap.types";

export function useDoubleTap<
  Target = Element,
  Callback extends DoubleTapCallback<Target> = DoubleTapCallback<Target>,
>(
  callback: Callback,
  threshold = 300,
  options: DoubleTapOptions<Target> = {},
): DoubleTapResult<Target, Callback> {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handler = useCallback<CallbackFunction<Target>>(
    (event: MouseEvent<Target>) => {
      if (timer.current == null) {
        timer.current = setTimeout(() => {
          if (options.onSingleTap != null) {
            options.onSingleTap(event);
          }
          timer.current = null;
        }, threshold);
      } else {
        clearTimeout(timer.current);
        timer.current = null;
        callback != null && callback(event);
      }
    },
    [callback, threshold, options.onSingleTap],
  );

  return (
    callback != null
      ? {
          onClick: handler,
        }
      : {}
  ) as DoubleTapResult<Target, Callback>;
}
