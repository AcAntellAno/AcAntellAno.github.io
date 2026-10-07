import {
  motion,
  motionValue,
  useTransform,
  type MotionValue,
} from 'motion/react';

// A <g>, not an <svg>: it lives inside <Study/> so the camera can move over the whole room.
// Everything that moves is a motion value you pass in, so nothing here re-renders while scrolling.
//   drawerY / drawerScale -> slide the top drawer toward you (0 -> 34, 1 -> 1.14)
//   boxScaleY             -> reveal the inside of the drawer (0 -> 1)
//   activeFolder          -> which folder is showing, as a number; the matching tab lifts.
//                            1.5 means halfway through folder 1. Same value drives <FolderCard/>.

export interface FilingCabinetIllustrationProps {
  sections: string[]; // one folder tab per section, back to front
  drawerY?: MotionValue<number>;
  drawerScale?: MotionValue<number>;
  boxScaleY?: MotionValue<number> | number;
  activeFolder?: MotionValue<number>;
  topLabel?: string;
}

const INK = '#161616';
const STEEL = '#8FA39A';
const STEEL_LIGHT = '#9DB1A7';
const TAB_X = [276, 300, 326, 270, 306]; // tab positions repeat so neighbors don't line up
// useTransform needs a motion value even when none is passed; this one never changes.
const FALLBACK = motionValue(-1);

export default function FilingCabinetIllustration({
  sections,
  drawerY,
  drawerScale,
  boxScaleY = 0,
  activeFolder,
  topLabel = 'TOP SECRET',
}: FilingCabinetIllustrationProps) {
  const n = Math.max(sections.length, 1);
  const rowH = 30 / n; // folders share the drawer's depth evenly

  return (
    <g>
      {/* Cabinet body and top */}
      <rect
        x="250"
        y="70"
        width="140"
        height="262"
        rx="6"
        fill={STEEL}
        stroke={INK}
        strokeWidth="5"
      />
      <rect
        x="244"
        y="64"
        width="152"
        height="12"
        rx="4"
        fill="#A9BBB2"
        stroke={INK}
        strokeWidth="4"
      />

      {/* Lower drawers (decoration) */}
      <g stroke={INK} strokeWidth="4">
        <rect
          x="258"
          y="166"
          width="124"
          height="76"
          rx="4"
          fill={STEEL_LIGHT}
        />
        <rect
          x="258"
          y="248"
          width="124"
          height="76"
          rx="4"
          fill={STEEL_LIGHT}
        />
        <rect
          x="300"
          y="178"
          width="40"
          height="16"
          fill="#FFFDF6"
          strokeWidth="2.5"
        />
        <rect
          x="300"
          y="260"
          width="40"
          height="16"
          fill="#FFFDF6"
          strokeWidth="2.5"
        />
        <rect
          x="296"
          y="206"
          width="48"
          height="10"
          rx="5"
          fill="#C9D3DA"
          strokeWidth="3"
        />
        <rect
          x="296"
          y="288"
          width="48"
          height="10"
          rx="5"
          fill="#C9D3DA"
          strokeWidth="3"
        />
      </g>
      <text
        x="320"
        y="190"
        textAnchor="middle"
        fontFamily="'Courier Prime', monospace"
        fontSize="8"
        fontWeight="700"
        fill={INK}
      >
        ARCHIVE
      </text>
      <text
        x="320"
        y="272"
        textAnchor="middle"
        fontFamily="'Courier Prime', monospace"
        fontSize="8"
        fontWeight="700"
        fill={INK}
      >
        MISC.
      </text>

      {/* Dark gap the top drawer slides out of */}
      <rect
        x="258"
        y="84"
        width="124"
        height="76"
        rx="4"
        fill="#2B3530"
        stroke={INK}
        strokeWidth="4"
      />

      {/* TOP DRAWER: slides out from the middle of its top edge */}
      <motion.g
        style={{
          y: drawerY,
          scale: drawerScale,
          transformBox: 'view-box',
          originX: '320px',
          originY: '84px',
        }}
      >
        {/* Inside of the drawer, growing upward from the drawer front */}
        <motion.g style={{ scaleY: boxScaleY, originY: 1 }}>
          <polygon
            points="266,46 374,46 382,84 258,84"
            fill="#5E6E66"
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {sections.map((label, i) => (
            <FolderTab
              key={label}
              label={label}
              index={i}
              count={n}
              rowH={rowH}
              activeFolder={activeFolder}
            />
          ))}
        </motion.g>

        {/* Drawer front */}
        <rect
          x="258"
          y="84"
          width="124"
          height="76"
          rx="4"
          fill={STEEL_LIGHT}
          stroke={INK}
          strokeWidth="4"
        />
        <rect
          x="296"
          y="96"
          width="48"
          height="16"
          fill="#FFFDF6"
          stroke={INK}
          strokeWidth="2.5"
        />
        <text
          x="320"
          y="107.5"
          textAnchor="middle"
          fontFamily="'Courier Prime', monospace"
          fontSize="7.5"
          fontWeight="700"
          fill="#D7392F"
        >
          {topLabel}
        </text>
        <rect
          x="296"
          y="124"
          width="48"
          height="10"
          rx="5"
          fill="#C9D3DA"
          stroke={INK}
          strokeWidth="3"
        />
        <circle
          cx="320"
          cy="146"
          r="4"
          fill="#F2C14E"
          stroke={INK}
          strokeWidth="2"
        />
      </motion.g>
    </g>
  );
}

interface FolderTabProps {
  label: string;
  index: number;
  count: number;
  rowH: number;
  activeFolder?: MotionValue<number>;
}

// One folder standing in the drawer. Its own component so it can own its useTransform hook.
function FolderTab({
  label,
  index: i,
  count: n,
  rowH,
  activeFolder,
}: FolderTabProps) {
  const t = n > 1 ? i / (n - 1) : 0;
  const y = 52 + i * rowH;
  const left = 268 - 8 * t;
  const right = 372 + 8 * t;
  const tabW = Math.max(30, label.length * 3.4 + 8);
  const tabX = Math.min(TAB_X[i % TAB_X.length], right - tabW - 2);

  // Lifts while its folder is showing: activeFolder between i and i + 1.
  const lift = useTransform(
    activeFolder ?? FALLBACK,
    [i, i + 0.1, i + 0.85, i + 0.95],
    [0, -4, -4, i === n - 1 ? -4 : 0],
  );

  return (
    <motion.g style={{ y: activeFolder ? lift : 0 }}>
      <path
        d={`M${left} ${y} H${right} V${y + 6} H${left} Z M${tabX} ${y} V${y - 6} h${tabW} v6`}
        fill={i % 2 ? '#D8B26C' : '#E9C98B'}
        stroke={INK}
        strokeWidth="2"
      />
      <text
        x={tabX + tabW / 2}
        y={y - 1.2}
        textAnchor="middle"
        fontFamily="'Courier Prime', monospace"
        fontSize="5.2"
        fontWeight="700"
        fill={INK}
      >
        {label.toUpperCase()}
      </text>
    </motion.g>
  );
}
