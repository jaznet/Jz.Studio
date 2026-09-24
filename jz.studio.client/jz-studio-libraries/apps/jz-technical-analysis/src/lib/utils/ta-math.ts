export type Num = number | null;

export function sma(values: readonly Num[], period: number): Num[] {
  const out = Array<Num>(values.length).fill(null);
  if (period <= 0 || values.length < period) return out;
  let sum = 0;
  let valid = 0;
  for (let index = 0; index < values.length; index++) {
    const added = values[index];
    if (added !== null) { sum += added; valid++; }
    if (index >= period) {
      const removed = values[index - period];
      if (removed !== null) { sum -= removed; valid--; }
    }
    if (index >= period - 1 && valid === period) out[index] = sum / period;
  }
  return out;
}

export function ema(
  values: readonly number[],
  period: number,
  multiplier = 2 / (period + 1)
): Num[] {
  const out = Array<Num>(values.length).fill(null);
  if (period <= 0 || values.length < period) return out;
  let seed = 0;
  for (let index = 0; index < period; index++) seed += values[index];
  let previous = seed / period;
  out[period - 1] = previous;
  for (let index = period; index < values.length; index++) {
    previous += multiplier * (values[index] - previous);
    out[index] = previous;
  }
  return out;
}

export function rollingMaximum(values: readonly number[], period: number): Num[] {
  return rollingExtreme(values, period, Math.max);
}

export function rollingMinimum(values: readonly number[], period: number): Num[] {
  return rollingExtreme(values, period, Math.min);
}

function rollingExtreme(
  values: readonly number[],
  period: number,
  compare: (left: number, right: number) => number
): Num[] {
  const out = Array<Num>(values.length).fill(null);
  if (period <= 0 || values.length < period) return out;
  for (let index = period - 1; index < values.length; index++) {
    let extreme = values[index - period + 1];
    for (let cursor = index - period + 2; cursor <= index; cursor++) {
      extreme = compare(extreme, values[cursor]);
    }
    out[index] = extreme;
  }
  return out;
}
