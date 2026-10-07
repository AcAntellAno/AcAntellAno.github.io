import { motion, useTransform, type MotionValue } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';

// A manila folder card (plain HTML, not SVG) that rises while its folder is the active one.
// activeFolder is the same motion value <FilingCabinet/> uses, so the tab and the card stay in step.

export interface FolderCardIllustrationProps {
  index: number;
  isLast: boolean;
  activeFolder: MotionValue<number>;
  tab: string;
  tabOffset?: number; // px from the left, so tabs don't all line up
  wide: boolean; // wide screens: card on the right; otherwise at the bottom
  children: ReactNode;
}

const INK = '#161616';
const MANILA = '#E9C98B';

export default function FolderCardIllustration({
  index: i,
  isLast,
  activeFolder,
  tab,
  tabOffset = 24,
  wide,
  children,
}: FolderCardIllustrationProps) {
  // In at the start of its turn, out near the end (the last one stays).
  const range = [i, i + 0.1, i + 0.85, i + 0.95];
  const opacity = useTransform(activeFolder, range, [0, 1, 1, isLast ? 1 : 0]);
  const y = useTransform(activeFolder, range, [80, 0, 0, isLast ? 0 : 80]);
  const visibility = useTransform(opacity, (o) =>
    o > 0.02 ? 'visible' : 'hidden',
  );

  const place: CSSProperties = wide
    ? {
        right: 'max(4vw, 16px)',
        top: '50%',
        width: 'min(420px, 42vw)',
        translate: '0 -50%',
      }
    : { left: 16, right: 16, bottom: 16 };

  return (
    <motion.article
      style={{ position: 'absolute', ...place, opacity, y, visibility }}
    >
      <span
        style={{
          display: 'inline-block',
          marginLeft: tabOffset,
          background: MANILA,
          border: `4px solid ${INK}`,
          borderBottom: 0,
          borderRadius: '12px 12px 0 0',
          padding: '4px 16px 2px',
          fontFamily: "'Courier Prime', monospace",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          position: 'relative',
          top: 4,
        }}
      >
        {tab}
      </span>
      <div
        style={{
          background: MANILA,
          border: `4px solid ${INK}`,
          borderRadius: '4px 16px 16px 16px',
          boxShadow: `8px 8px 0 ${INK}`,
          padding: 20,
          maxHeight: wide ? 'min(66vh, 520px)' : '50vh',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            background: '#FFFDF6',
            border: `3px solid ${INK}`,
            borderRadius: 6,
            padding: '14px 16px',
            display: 'grid',
            gap: 10,
          }}
        >
          {children}
        </div>
      </div>
    </motion.article>
  );
}
