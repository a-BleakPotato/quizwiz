import { useEffect, useReducer, useRef } from 'react';
import Icon from '../components/Icon';
import { Halftone } from '../components/Art';
import Results from './Results';
import { useApp } from '../AppContext';
import { initialQuiz, quizReducer } from '../quizReducer';
import useDocumentTitle from '../useDocumentTitle';

export default function Flashcards({ subjectId, lessonId }) {
  const { db, dispatch: dispatchDb, modal } = useApp();
  const lesson = db.subjects.find((s) => s.id === subjectId)?.lessons.find((l) => l.id === lessonId);
  const [q, dispatch] = useReducer(quizReducer, undefined, () => initialQuiz(subjectId, lessonId));
  const qRef = useRef(q);
  qRef.current = q;
  const busyRef = useRef(false);
  const navToken = useRef(0);
  const timer = useRef(null);
  const frontHit = useRef(null);
  const backHit = useRef(null);
  const nextBtn = useRef(null);
  const prevBtn = useRef(null);
  const rateBtns = useRef({});
  const pendingFocus = useRef(null);
  useDocumentTitle(lesson ? `${lesson.name} - QuizWiz` : 'QuizWiz');

  useEffect(() => () => {
    // The auto-advance timer must not survive navigation away from the quiz.
    timer.current && clearTimeout(timer.current);
    navToken.current++;
  }, []);

  useEffect(() => {
    if (!pendingFocus.current) return;
    const target = pendingFocus.current;
    const node = target === 'front' ? frontHit.current
      : target === 'back' ? backHit.current
      : target === 'next' ? nextBtn.current
      : target === 'prev' ? prevBtn.current
      : rateBtns.current[target];
    node?.focus();
    pendingFocus.current = null;
  }, [q.i, q.fl, q.done, q.res]);

  if (!lesson || !lesson.cards.length) return null; // the route gate redirects before this renders
  const cards = lesson.cards;
  const card = cards[q.i];
  const n = cards.length;
  const rating = q.res[card.id];
  const size = (t) => (t.length > 220 ? 'xs' : t.length > 110 ? 'sm' : '');

  function clearTimer() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    navToken.current++;
  }

  function finish() {
    const current = qRef.current;
    const last = { sc: cards.filter((c) => current.res[c.id] === 'm').length, ms: Date.now() - current.t0 };
    dispatchDb({ type: 'finish-quiz', sid: subjectId, lid: lessonId, last });
    dispatch({ type: 'finish' });
    clearTimer();
    busyRef.current = false;
  }

  function goNext() {
    clearTimer();
    busyRef.current = false;
    if (qRef.current.i < cards.length - 1) {
      pendingFocus.current = 'next';
      dispatch({ type: 'next', count: cards.length });
    } else {
      finish();
    }
  }

  function goPrev() {
    if (qRef.current.i === 0) return;
    clearTimer();
    busyRef.current = false;
    pendingFocus.current = 'prev';
    dispatch({ type: 'prev' });
  }

  useEffect(() => {
    // EVENT: global keydown - ArrowLeft/ArrowRight move between flashcards (added in useEffect with cleanup)
    const onKey = (e) => {
      if (modal || q.done || e.target.closest('input,textarea')) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, q.done, q.i]);

  const rate = (status) => {
    // EVENT: onClick - HARD / MASTERED saves the status immediately, then auto-advances
    if (busyRef.current) return; // guard against double clicks
    busyRef.current = true;
    const current = qRef.current;
    const token = navToken.current;
    dispatch({ type: 'rate', cardId: card.id, status });
    dispatchDb({ type: 'rate-card', sid: subjectId, lid: lessonId, cardId: card.id, status });
    pendingFocus.current = status;

    // EVENT: setTimeout - about 350ms after rating, advance (or finish on the last card)
    timer.current = setTimeout(() => {
      timer.current = null;
      if (navToken.current !== token) return; // stale timer after navigating away/back
      goNext();
    }, 350);
  };

  if (q.done) {
    return <Results lesson={lesson} subjectId={subjectId} results={q.res} onRetake={() => {
      // EVENT: onClick - RETAKE resets the local quiz session
      clearTimer();
      busyRef.current = false;
      dispatch({ type: 'retake' });
    }} />;
  }

  return (
    <div className="wrap">
      <div className="qh">
        <div>
          <h1>{lesson.name}</h1>
          <p id="sub">{q.fl ? 'Rate how well you knew it' : 'Click to reveal answer'}</p>
        </div>
        <div className="prog" aria-live="polite">
          {q.i + 1}/{n}
          <div className="track"><b style={{ width: `${((q.i + 1) / n) * 100}%` }} /></div>
        </div>
      </div>
      <div className={`flash${q.fl ? ' f' : ''}`}>
        <div className="fi">
          <div className="face" inert={q.fl ? '' : undefined} onClick={() => {
            // EVENT: onClick - click anywhere on the card to flip (front face)
            pendingFocus.current = q.fl ? 'front' : 'back';
            dispatch({ type: 'flip' });
          }}>
            <Halftone />
            <button className="hit" ref={frontHit} aria-label="Reveal answer" />
            <span className="lab">Question {q.i + 1}</span>
            <p className={`tx ${size(card.q)}`}>{card.q}</p>
            <span className="hint">Click anywhere to flip</span>
          </div>
          <div className="face b" inert={q.fl ? undefined : ''} onClick={() => {
            // EVENT: onClick - click anywhere on the card to flip (answer face)
            pendingFocus.current = q.fl ? 'front' : 'back';
            dispatch({ type: 'flip' });
          }}>
            <Halftone />
            <button className="hit" ref={backHit} aria-label="Show question again" />
            <span className="lab">Question {q.i + 1}</span>
            <p className={`tx ${size(card.a)}`}>{card.a}</p>
            <div className="rate">
              <button
                ref={(node) => { rateBtns.current.h = node; }}
                className={`btn r${rating === 'h' ? ' on' : ''}`}
                aria-pressed={rating === 'h'}
                onClick={(e) => {
                  // EVENT: onClick - HARD does not flip the card
                  e.stopPropagation();
                  rate('h');
                }}
              >HARD</button>
              <button
                ref={(node) => { rateBtns.current.m = node; }}
                className={`btn y${rating === 'm' ? ' on' : ''}`}
                aria-pressed={rating === 'm'}
                onClick={(e) => {
                  // EVENT: onClick - MASTERED does not flip the card
                  e.stopPropagation();
                  rate('m');
                }}
              >MASTERED</button>
            </div>
          </div>
        </div>
      </div>
      <div className="qn">
        <button className="btn" ref={prevBtn} disabled={!q.i} onClick={goPrev}>
          {/* EVENT: onClick - PREV goes to the previous card */}
          <Icon name="back" size={25} />PREV
        </button>
        <button className="btn t" ref={nextBtn} onClick={goNext}>
          {/* EVENT: onClick - NEXT goes forward; FINISH shows results on the last card */}
          {q.i === n - 1 ? 'FINISH' : 'NEXT'}<Icon name="arrow" size={25} />
        </button>
      </div>
    </div>
  );
}
