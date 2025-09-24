// src/library/jz-charts/techanTs/utils/tamath.ts
export type Num = number | null;

/** Simple moving average. Returns an array aligned with input (nulls until warm-up). */
// ta-math.ts
export function sma(values: number[], period: number): Array<number | null> {
  const n = values.length;
  const out = Array<number | null>(n).fill(null);
  if (period <= 0 || n === 0 || period > n) return out;

  let sum = 0;
  for (let i = 0; i < period; i++) sum += values[i];
  out[period - 1] = sum / period;

  for (let i = period; i < n; i++) {
    sum += values[i] - values[i - period];
    out[i] = sum / period;
  }
  return out;
}

