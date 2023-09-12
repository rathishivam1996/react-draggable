export interface MeasureNodeResult<T extends Element> {
  measuredRef: (node: T) => void;
  height: number;
}
