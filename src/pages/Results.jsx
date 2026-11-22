import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { Halftone } from '../components/Art';

export default function Results({ lesson, subjectId, results, onRetake }) {
  const n = lesson.cards.length;
  const last = lesson.last || { sc: 0, ms: 0 };
  const m = Math.floor(last.ms / 60000);
  const s = String(Math.floor(last.ms / 1000) % 60).padStart(2, '0');

  return (
    <div className="wrap">
      <div className="qh">
        <div>
          <h1>{lesson.name}</h1>
          <p>Completed review</p>
        </div>
      </div>
      <section className="res">
        <Halftone />
        <div>
          <p>Total Score:</p>
          <p className="big">{last.sc}/{n}</p>
          <div className="two">
            <div><p>Duration:</p><b>{m}:{s} mins</b></div>
            <div><p>Accuracy</p><b>{n ? Math.round((last.sc / n) * 100) : 0}%</b></div>
          </div>
        </div>
        <div>
          <div className="bh"><b>Question Breakdown</b><b>Marks</b></div>
          <div className="rows">
            {lesson.cards.map((c, i) => (
              <div className="qr" key={c.id}>
                <b>Q{i + 1}</b>
                <span>{c.q}</span>
                {results[c.id] === 'm'
                  ? <Icon name="ok" size={25} color="#2a9d0f" />
                  : <Icon name="no" size={25} color="#ff4f38" />}
              </div>
            ))}
          </div>
          <div className="foot2">
            <button className="btn" onClick={onRetake}>
              {/* EVENT: onClick - RETAKE starts a fresh quiz session */}
              RETAKE
            </button>
            <Link className="btn t" to={`/subject/${subjectId}`}>
              <Icon name="back" size={25} />BACK TO LESSONS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
