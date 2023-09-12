import { useCallback, useLayoutEffect, useState } from "react";
import type { MeasureNodeResult } from "./use-measurable.types";

function useMeasureNode<
  Target extends Element = Element,
>(): MeasureNodeResult<Target> {
  const [height, setHeight] = useState(0);
  const [measurable, setMeasurable] = useState<Target | undefined>(undefined);

  const measuredRef = useCallback((node: Target) => {
    if (node !== null) {
      setMeasurable(node);
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  useLayoutEffect(() => {
    if (measurable !== undefined) {
      const measure = (): void => {
        setHeight(measurable.getBoundingClientRect().height);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onClick = (e: any): void => {
        // eslint-disable-next-line no-console
        console.log(`clicked with event ${JSON.stringify(e, null, 4)}`);
        // eslint-disable-next-line no-console
        console.log(`on click event pointer type ${e.pointerType}`);
      };

      measurable.addEventListener("click", onClick);
      window.addEventListener("resize", measure);

      return () => {
        window.removeEventListener("resize", measure);
      };
    }
  }, [measurable]);

  return { measuredRef, height };
}

export default useMeasureNode;
