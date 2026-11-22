import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import Icon from './Icon';
import { uid } from '../data';

const emptyRow = () => ({ rowKey: uid(), id: '', q: '', a: '' });

export default function LessonForm({ lesson, onClose, onSave }) {
  const [title, setTitle] = useState(lesson?.name || '');
  const [rows, setRows] = useState(() => (lesson ? lesson.cards.map((c) => ({ rowKey: c.id, id: c.id, q: c.q, a: c.a })) : [emptyRow()]));
  const [titleError, setTitleError] = useState('');
  const [rowErrors, setRowErrors] = useState({});
  const [cardsError, setCardsError] = useState('');
  const [focusKey, setFocusKey] = useState(null);
  const titleRef = useRef(null);
  const inputs = useRef({});

  useEffect(() => {
    if (!focusKey) return;
    const input = inputs.current[focusKey];
    input?.scrollIntoView({ block: 'nearest' });
    input?.focus();
    setFocusKey(null);
  }, [focusKey, rows.length]);

  const changeRow = (rowKey, field, value) => {
    // EVENT: onChange (input) - edit a card question/answer and clear its inline error
    setRows((list) => list.map((r) => (r.rowKey === rowKey ? { ...r, [field]: value } : r)));
    setRowErrors((errors) => ({ ...errors, [rowKey]: '' }));
    setCardsError('');
  };

  const submit = (e) => {
    // EVENT: onSubmit - validate lesson title and cards, then save (Enter also submits)
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setTitleError('Enter a lesson title.');
      titleRef.current?.focus();
      return;
    }

    const valid = [];
    const errors = {};
    let ok = true;
    rows.forEach((r) => {
      const q = r.q.trim();
      const a = r.a.trim();
      if (!q && !a) return; // fully empty rows are ignored
      if (!q || !a) {
        errors[r.rowKey] = q ? 'Add an answer.' : 'Add a question.';
        ok = false;
        return;
      }
      valid.push({ id: r.id, q, a });
    });
    setRowErrors(errors);
    if (!ok) return;
    if (!valid.length) {
      setCardsError('Add at least one card with a question and an answer.');
      return;
    }

    const old = new Map((lesson?.cards || []).map((c) => [c.id, c]));
    const cards = valid.map((c) => {
      const o = old.get(c.id);
      return { id: o ? o.id : uid(), q: c.q, a: c.a, st: o && o.q === c.q && o.a === c.a ? o.st : null };
    });
    onSave({ name: t, cards });
  };

  return (
    <Modal
      title={lesson ? lesson.name : 'Add Lesson'}
      subtitle={lesson ? 'Modify and add cards' : 'Create a lesson and add cards'}
      onClose={onClose}
      onSubmit={submit}
    >
      <div className="fld">
        <label className="lb" htmlFor="f1">Lesson Title:</label>
        <input
          ref={titleRef}
          className="in"
          id="f1"
          name="t"
          maxLength={40}
          placeholder="Add lesson title"
          value={title}
          onChange={(e) => {
            // EVENT: onChange (input) - update title and clear its inline error
            setTitle(e.target.value);
            setTitleError('');
          }}
        />
        <p className="err" role="alert">{titleError}</p>
      </div>
      <div>
        <div className="cards">
          {rows.map((row, i) => (
            <div className="cc" key={row.rowKey}>
              <div>
                <span className="cn">Card {i + 1}</span>
                <button
                  type="button"
                  className="del"
                  disabled={rows.length === 1}
                  aria-label="Delete card"
                  onClick={() => {
                    // EVENT: onClick - delete a card row (disabled when only one is left)
                    setRows((list) => list.filter((r) => r.rowKey !== row.rowKey));
                    setRowErrors((errors) => ({ ...errors, [row.rowKey]: '' }));
                  }}
                >
                  <Icon name="trash" />
                </button>
              </div>
              <div>
                <span className="lb">Question</span>
                <input
                  ref={(node) => { inputs.current[row.rowKey] = node; }}
                  className="in"
                  data-k="q"
                  maxLength={200}
                  aria-label="Question"
                  placeholder="Add a question"
                  value={row.q}
                  onChange={(e) => changeRow(row.rowKey, 'q', e.target.value)}
                />
              </div>
              <div>
                <span className="lb">Answer</span>
                <input
                  className="in"
                  data-k="a"
                  maxLength={300}
                  aria-label="Answer"
                  placeholder="Add an answer"
                  value={row.a}
                  onChange={(e) => changeRow(row.rowKey, 'a', e.target.value)}
                />
              </div>
              <p className="err" role="alert">{rowErrors[row.rowKey]}</p>
            </div>
          ))}
        </div>
        <p className="err" role="alert">{cardsError}</p>
      </div>
      <button
        type="button"
        className="btn y"
        onClick={() => {
          // EVENT: onClick - ADD CARD appends a row, scrolls to it and focuses it
          const row = emptyRow();
          setRows((list) => [...list, row]);
          setFocusKey(row.rowKey);
        }}
      >
        <Icon name="plus" size={28} />ADD CARD
      </button>
      <div className="foot">
        <button type="button" className="btn" onClick={onClose}>
          {/* EVENT: onClick - cancel */}
          CANCEL
        </button>
        <button className="btn t">{lesson ? 'SAVE' : 'ADD LESSON'}</button>
      </div>
    </Modal>
  );
}
