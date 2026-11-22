/* Data helpers: schema, sample data, validation and the db reducer. */

export const KEY = 'quizwiz.v1';

export const uid = () => Math.random().toString(36).slice(2, 9);

const lesson = (name, qa) => ({
  id: uid(),
  name,
  last: null,
  cards: qa.map(([q, a]) => ({ id: uid(), q, a, st: null })),
});

const subject = (name, desc, lessons) => ({ id: uid(), name, desc, lessons });

export const SEED = () => [
  subject('Event-Driven Programming', 'How programs react to clicks, keys, timers and messages.', [
    lesson('DOM Events', [
      ['What is an event?', 'A signal that something happened, such as a click or a key press.'],
      ['What does addEventListener do?', 'It registers a function that runs each time the event fires on that element.'],
      ['What is event bubbling?', 'The event travels up from the target through its ancestors.'],
      ['What is event delegation?', 'One listener on a parent handles events from many children by checking event.target.'],
      ['What does preventDefault() do?', 'It stops the default browser action, such as submitting a form.'],
    ]),
    lesson('Event Loop', [
      ['What does the call stack hold?', 'The functions that are currently running.'],
      ['Where do callbacks wait?', 'In the task queue until the call stack is empty.'],
      ['Why does setTimeout(fn, 0) not run at once?', 'Its callback must wait in the queue until the current code finishes.'],
    ]),
  ]),
  subject('JavaScript Basics', 'Core language features.', [
    lesson('Variables', [
      ['Which keyword declares a block-scoped variable you can reassign?', 'let'],
      ['Which keyword declares a constant binding?', 'const'],
      ['What does typeof null return?', '"object" (a long-standing quirk).'],
    ]),
    lesson('Functions', [
      ['What is a callback?', 'A function passed to another function to be called later.'],
      ['What is a closure?', 'A function that remembers variables from the scope where it was created.'],
    ]),
  ]),
  subject('HTML and CSS', 'Structure and style.', [
    lesson('Semantic HTML', [
      ['Why use <nav> instead of <div>?', 'It tells browsers and screen readers that the content is navigation.'],
      ['Which element wraps the main content of a page?', '<main>'],
    ]),
    lesson('Flexbox', [
      ['Which property sets the main axis direction?', 'flex-direction'],
      ['Which property spreads items along the main axis?', 'justify-content'],
      ['Which property aligns items on the cross axis?', 'align-items'],
    ]),
  ]),
];

export const FILTERS = {
  all: 'All Subjects',
  prog: 'In Progress',
  new: 'Not Started',
  done: 'Mastered',
};

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isId = (v) => typeof v === 'string' && v.length > 0;

export function isValidDb(value) {
  if (!isObject(value) || !Array.isArray(value.subjects)) return false;
  return value.subjects.every(
    (s) =>
      isObject(s) &&
      isId(s.id) &&
      typeof s.name === 'string' &&
      typeof s.desc === 'string' &&
      Array.isArray(s.lessons) &&
      s.lessons.every(
        (l) =>
          isObject(l) &&
          isId(l.id) &&
          typeof l.name === 'string' &&
          Array.isArray(l.cards) &&
          l.cards.every((c) => isObject(c) && isId(c.id) && typeof c.q === 'string' && typeof c.a === 'string' && (c.st === null || c.st === 'm' || c.st === 'h')) &&
          (l.last === null || (isObject(l.last) && typeof l.last.sc === 'number' && typeof l.last.ms === 'number'))
      )
  );
}

/* localStorage reads are wrapped: a missing, corrupt or blocked store seeds fresh data. */
export function loadDb() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return { subjects: SEED() };
    const value = JSON.parse(raw);
    return isValidDb(value) ? value : { subjects: SEED() };
  } catch {
    return { subjects: SEED() };
  }
}

/* Returns false on failure so the caller can show a toast. */
export function saveDb(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
    return true;
  } catch {
    return false;
  }
}

export function readStorageValue(raw) {
  if (raw === null) return null;
  try {
    const value = JSON.parse(raw);
    return isValidDb(value) ? value : null;
  } catch {
    return null;
  }
}

export const pct = (lessons) => {
  const total = lessons.reduce((n, l) => n + l.cards.length, 0);
  if (!total) return 0;
  return Math.round((lessons.reduce((n, l) => n + l.cards.filter((c) => c.st === 'm').length, 0) / total) * 100);
};

const mapSubject = (db, sid, fn) => ({
  ...db,
  subjects: db.subjects.map((s) => (s.id === sid ? fn(s) : s)),
});

const mapLesson = (db, sid, lid, fn) =>
  mapSubject(db, sid, (s) => ({
    ...s,
    lessons: s.lessons.map((l) => (l.id === lid ? fn(l) : l)),
  }));

export function dbReducer(db, action) {
  switch (action.type) {
    case 'replace':
      return action.db;

    case 'add-subject':
      return { ...db, subjects: [...db.subjects, { id: uid(), name: action.name, desc: action.desc, lessons: [] }] };

    case 'edit-subject':
      return mapSubject(db, action.id, (s) => ({ ...s, name: action.name, desc: action.desc }));

    case 'add-lesson':
      return mapSubject(db, action.sid, (s) => ({
        ...s,
        lessons: [...s.lessons, { id: uid(), name: action.name, cards: action.cards, last: null }],
      }));

    case 'edit-lesson':
      return mapLesson(db, action.sid, action.id, (l) => ({ ...l, name: action.name, cards: action.cards }));

    case 'rate-card':
      return mapLesson(db, action.sid, action.lid, (l) => ({
        ...l,
        cards: l.cards.map((c) => (c.id === action.cardId ? { ...c, st: action.status } : c)),
      }));

    case 'finish-quiz':
      return mapLesson(db, action.sid, action.lid, (l) => ({ ...l, last: action.last }));

    default:
      return db;
  }
}
