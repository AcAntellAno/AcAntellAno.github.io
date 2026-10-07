import { motion, type MotionValue } from 'motion/react';
import type { CSSProperties } from 'react';
import FilingCabinetIllustration, {
  type FilingCabinetIllustrationProps,
} from './FilingCabinetIllustration';
import type { CameraStop } from '../../components/utils/camera';

// The home study: paneled wall, framed flag, desk with a lamp, and the filing cabinet.
// Pass `viewBox` as a motion value (from useTransform) to move the camera without re-rendering.
// Everything else is passed straight through to <FilingCabinet/>.

export const STUDY_STOPS = {
  room: { cx: 320, cy: 160, zoom: 380 }, // whole study
  cabinet: { cx: 320, cy: 200, zoom: 290 }, // cabinet fills the screen
  drawer: { cx: 320, cy: 118, zoom: 150 }, // top drawer, closed
  inside: { cx: 320, cy: 98, zoom: 120, bias: 1 }, // looking into the open drawer, room for a card
} satisfies Record<string, CameraStop>;

export interface StudyProps extends FilingCabinetIllustrationProps {
  viewBox?: MotionValue<string> | string;
  className?: string;
  style?: CSSProperties;
}

const INK = '#161616';

export default function StudyIllustration({
  viewBox = '0 0 640 360',
  className,
  style,
  ...cabinet
}: StudyProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={style}
      role="img"
      aria-label="A home study with a green steel filing cabinet labeled Top Secret"
    >
      <defs>
        {/* Unique ids so they don't clash with other SVGs on the page */}
        <pattern
          id="study-panel"
          width="32"
          height="360"
          patternUnits="userSpaceOnUse"
        >
          <rect width="32" height="360" fill="#2A4478" />
          <rect width="3" height="360" fill="#22396A" />
        </pattern>
        <pattern
          id="study-floor"
          width="60"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <rect width="60" height="16" fill="#B5793B" />
          <path d="M0 15.5 H60 M30 0 V16" stroke="#8C5A28" strokeWidth="2" />
        </pattern>
      </defs>

      {/* Wall and floor run far past the edges so zooming never shows a blank border */}
      <rect
        x="-3000"
        y="-3000"
        width="6640"
        height="3330"
        fill="url(#study-panel)"
      />
      <rect
        x="-3000"
        y="330"
        width="6640"
        height="3000"
        fill="url(#study-floor)"
        stroke={INK}
        strokeWidth="4"
      />

      {/* Desk with a lamp and a notepad */}
      <g stroke={INK} strokeWidth="4">
        <rect x="440" y="230" width="180" height="16" fill="#B5793B" />
        <rect x="452" y="246" width="56" height="84" fill="#9A632C" />
        <rect x="600" y="246" width="12" height="84" fill="#9A632C" />
        <path d="M470 230 l10 -40" fill="none" strokeWidth="5" />
        <path d="M480 190 l30 -14" fill="none" strokeWidth="5" />
        <path
          d="M498 168 l34 0 l10 22 l-54 0 Z"
          fill="#5FA845"
          strokeLinejoin="round"
        />
        <rect x="462" y="224" width="30" height="8" rx="3" fill={INK} />
        <rect
          x="560"
          y="214"
          width="34"
          height="16"
          fill="#FFFDF6"
          strokeWidth="3"
        />
      </g>
      <polygon
        points="508,190 532,190 556,232 486,232"
        fill="#F2C14E"
        opacity="0.25"
      />

      <FilingCabinetIllustration {...cabinet} />
    </motion.svg>
  );
}
