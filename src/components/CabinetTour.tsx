import { motion, useMotionValue, useScroll, useTransform } from 'motion/react';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import StudyIllustration, {
  STUDY_STOPS,
} from '../assets/illustrations/StudyIllustration';
import FolderCardIllustration from '../assets/illustrations/FolderIllustration';
import {
  cameraAt,
  isWide,
  toViewBox,
  type CameraKey,
} from '../components/utils/camera';

interface Section {
  tab: string;
  title: string;
  body: ReactNode;
}

const SECTIONS: Section[] = [
  {
    tab: 'About me',
    title: "Hi, I'm Anthony.",
    body: <p>I am a Fullstack Software Engineer.</p>,
  },
  {
    tab: 'Skills',
    title: "What I'm cleared for",
    body: <p>React · TypeScript · Python · Java</p>,
  },
  {
    tab: 'Work history',
    title: "Where I've worked",
    body: (
      <>
        <p>April 2022 – Present · Software Engineer II at Intuit</p>
        <p>
          Janurary 2019 – March 2022 · Associate Software Engineer at Chevron
        </p>
      </>
    ),
  },
  {
    tab: 'Projects',
    title: 'Operations',
    body: (
      <section>
        <p>
          <strong>Operation Agentic Workflow: </strong>built a fullstack agentic
          workflow leveraging OpenAI SDK, Langgraph, Python, FastAPI and React
          to build a workflow that took down customer requests, provided work
          estimates, booked appointments and created work orders for an
          imaginary electrical company.
        </p>
        <br />
        <p>
          <strong>Operation Cantello Electric: </strong>built a landing page for
          an electrical company with HTML and CSS.
        </p>
      </section>
    ),
  },
  {
    tab: 'Contact',
    title: 'Send me a mission',
    body: (
      <a href="mailto:acantellano1996@gmail.com">acantellano1996@gmail.com</a>
    ),
  },
];
const TAB_OFFSETS = [20, 110, 200, 30, 140];

const CAMERA: CameraKey[] = [
  [0, STUDY_STOPS.room],
  [0.16, STUDY_STOPS.cabinet],
  [0.25, STUDY_STOPS.drawer],
  [0.31, STUDY_STOPS.drawer],
  [0.375, STUDY_STOPS.inside],
];
const DRAWER_OPENS: [number, number] = [0.24, 0.355];
const FOLDERS: [number, number] = [0.375, 0.98];

export default function CabinetTour() {
  const tourRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // 0 when the tour's top reaches the top of the screen, 1 when its bottom reaches the bottom.
  const { scrollYProgress: p } = useScroll({
    target: tourRef,
    offset: ['start start', 'end end'],
  });

  // Screen size as motion values (for the camera) plus one piece of state (for card layout).
  const width = useMotionValue(1280);
  const height = useMotionValue(720);
  const [wide, setWide] = useState(true);
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      width.set(w);
      height.set(h);
      setWide(isWide(w, h));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [width, height]);

  // Camera: progress + screen size -> viewBox string.
  const viewBox = useTransform(() =>
    toViewBox(cameraAt(CAMERA, p.get()), width.get(), height.get()),
  );

  // Drawer slides toward you while its inside opens up.
  const drawerY = useTransform(p, DRAWER_OPENS, [0, 34]);
  const drawerScale = useTransform(p, DRAWER_OPENS, [1, 1.14]);
  const boxScaleY = useTransform(p, DRAWER_OPENS, [0, 1]);

  // Which folder is showing: 0 at the start of the folder phase, SECTIONS.length at the end.
  const activeFolder = useTransform(p, FOLDERS, [0, SECTIONS.length]);

  const introOpacity = useTransform(p, [0, 0.09], [1, 0]);

  return (
    <section ref={tourRef} style={{ height: '1000vh', position: 'relative' }}>
      <div
        ref={stageRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100dvh',
          overflow: 'hidden',
          background: '#1B2F5E',
        }}
      >
        <StudyIllustration
          viewBox={viewBox}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
          sections={SECTIONS.map((s) => s.tab)}
          drawerY={drawerY}
          drawerScale={drawerScale}
          boxScaleY={boxScaleY}
          activeFolder={activeFolder}
        />

        <motion.div
          style={{
            opacity: introOpacity,
            position: 'absolute',
            left: 16,
            right: 16,
            top: 'max(5vh, 40px)',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: "'Lilita One', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(34px, 7vw, 68px)',
              color: '#FFFDF6',
              textShadow: '4px 4px 0 #161616',
            }}
          >
            Scroll to open my filing cabinet.
          </h1>
        </motion.div>

        {SECTIONS.map((s, i) => (
          <FolderCardIllustration
            key={s.tab}
            index={i}
            isLast={i === SECTIONS.length - 1}
            activeFolder={activeFolder}
            tab={s.tab}
            tabOffset={TAB_OFFSETS[i % TAB_OFFSETS.length]}
            wide={wide}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: "'Lilita One', sans-serif",
                fontWeight: 400,
                color: '#1B2F5E',
              }}
            >
              {s.title}
            </h2>
            {s.body}
          </FolderCardIllustration>
        ))}
      </div>
    </section>
  );
}
