export function linear(x: number) {
  return x;
}

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}
