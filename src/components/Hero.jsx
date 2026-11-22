import { HeroArt, Highlighter } from './Art';
import { useApp } from '../AppContext';
import { pct } from '../data';

export default function Hero() {
  const { db } = useApp();
  return (
    <section className="hero">
      <div>
        <h1>Your learning journey starts here</h1>
        <p>Keep practicing, track your progress, and turn what you learn into what you know.</p>
      </div>
      <div className="stats">
        <div className="stat">
          <span><Highlighter />Overall Mastery:</span>
          <b>{pct(db.subjects.flatMap((s) => s.lessons))}%</b>
        </div>
        <div className="stat">
          <span><Highlighter />Subjects:</span>
          <b>{db.subjects.length}</b>
        </div>
      </div>
      <HeroArt />
    </section>
  );
}
