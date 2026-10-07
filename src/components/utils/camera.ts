// A camera position in drawing units. (cx, cy) is the point to look at,
// zoom is how many units fit across the screen's shorter side.
// bias 0 keeps the object centered; 1 nudges it aside to leave room for a folder card.
export interface CameraStop {
  cx: number;
  cy: number;
  zoom: number;
  bias?: number;
}

// A camera stop pinned to a point in the scroll (0 = top of the tour, 1 = bottom).
export type CameraKey = [progress: number, stop: CameraStop];

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Where the camera is at scroll progress p, eased between the two nearest keys.
export function cameraAt(keys: CameraKey[], p: number): CameraStop {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [p0, a] = keys[i - 1];
    const [p1, b] = keys[i];
    if (p <= p1) {
      const t = easeInOut((p - p0) / (p1 - p0));
      return {
        cx: lerp(a.cx, b.cx, t),
        cy: lerp(a.cy, b.cy, t),
        zoom: lerp(a.zoom, b.zoom, t),
        bias: lerp(a.bias ?? 0, b.bias ?? 0, t),
      };
    }
  }
  return keys[keys.length - 1][1];
}

// Turns a camera stop into a viewBox string that fits a screen of width w and height h.
export function toViewBox(
  { cx, cy, zoom, bias = 0 }: CameraStop,
  w: number,
  h: number,
): string {
  const aspect = (w || 1) / (h || 1);
  // zoom = units across the shorter side, so phones and desktops see the same framing
  const viewW = aspect >= 1 ? zoom * aspect : zoom;
  const viewH = aspect >= 1 ? zoom : zoom / aspect;
  // Wide screens: card on the right, so shift the object left. Tall screens: card at the bottom, shift up.
  const wide = isWide(w, h);
  const fx = wide ? 0.5 - 0.2 * bias : 0.5;
  const fy = wide ? 0.5 : 0.5 - 0.24 * bias;
  return `${cx - viewW * fx} ${cy - viewH * fy} ${viewW} ${viewH}`;
}

export const isWide = (w: number, h: number) => w > 760 && w >= h;
