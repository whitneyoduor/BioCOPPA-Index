import { useLayoutEffect, useRef, useState } from 'react';

/** Observe the width of a container so SVG charts render crisply at any size. */
export function useMeasuredWidth<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref as React.RefObject<T>, width];
}

/** Colour scale for weighted scores (1-25): soft terracotta -> ochre -> sage. */
export function weightColor(weightedScore: number): string {
  const t = Math.max(0, Math.min(1, (weightedScore - 1) / 24));
  const a: [number, number, number] = [196, 122, 108]; // soft terracotta
  const b: [number, number, number] = [207, 167, 110]; // soft ochre
  const c: [number, number, number] = [122, 160, 133]; // soft sage
  const lerp = (x: [number, number, number], y: [number, number, number], f: number) =>
    x.map((v, i) => Math.round(v + (y[i] - v) * f)) as [number, number, number];
  const col = t < 0.5 ? lerp(a, b, t * 2) : lerp(b, c, (t - 0.5) * 2);
  return `rgb(${col.join(',')})`;
}

/** Interpolate between two hex colours for chart gradients. */
export function lerpColor(x: string, y: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const a = parse(x);
  const b = parse(y);
  const col = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${col.join(',')})`;
}
