/* Exported design assets. SVGs are imported untouched; only their placement lives in CSS. */
import logoUrl from '../assets/Logo.svg';
import heroUrl from '../assets/Hero Bg.svg';
import halftoneUrl from '../assets/Halftone.svg';
import subject1 from '../assets/Subject Bg1.svg';
import subject2 from '../assets/Subject Bg2.svg';
import subject3 from '../assets/Subject Bg3.svg';
import scribbleUrl from '../assets/Scribble.svg';

export const SUBJECT_ART = [subject1, subject2, subject3];

export function Logo() {
  return <img src={logoUrl} alt="" width="201" height="48" />;
}

export function HeroArt() {
  return <img className="art" src={heroUrl} alt="" width="471" height="295" />;
}

/* Two copies, both top:-2px and pinned to their card edge. The SVG is dark on its
   left side, so the left copy is unflipped and the right copy is mirrored. */
export function Halftone() {
  return (
    <span className="halftone" aria-hidden="true">
      <img className="halftone-l" src={halftoneUrl} alt="" width="460" height="538" />
      <img className="halftone-r" src={halftoneUrl} alt="" width="460" height="538" />
    </span>
  );
}

export function SubjectArt({ index }) {
  return <img className="card-art" src={SUBJECT_ART[index % SUBJECT_ART.length]} alt="" />;
}

export function Highlighter() {
  return <img className="scribble" src={scribbleUrl} alt="" aria-hidden="true" />;
}

/* PENDING ASSET (#6): lesson line/dot art SVG was not in the export.
   Until it arrives this keeps the original LA(colour) placeholder artwork. */
export function LessonArt({ index }) {
  const colours = ['#5759d4', '#fcdd1c', '#ff4f38'];
  const c = colours[index % colours.length];
  return (
    <svg className="card-art" viewBox="0 0 286 303" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="156" y="22" width="119" height="11" fill={c} />
      <path d="M58 28H284M228 -12V190" stroke="#000" strokeWidth="2" fill="none" />
      <g fill="#000">
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx="200" cy={52 + i * 12} r="2" />)}
      </g>
    </svg>
  );
}
