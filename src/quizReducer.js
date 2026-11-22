/* Quiz session state is local to <Flashcards>. */
export const initialQuiz = (sid, lid) => ({
  sid,
  lid,
  i: 0,
  fl: false,
  res: {},
  t0: Date.now(),
  done: false,
  busy: false,
});

export function quizReducer(state, action) {
  switch (action.type) {
    case 'flip':
      return { ...state, fl: !state.fl };
    case 'rate':
      return { ...state, res: { ...state.res, [action.cardId]: action.status }, busy: true };
    case 'next':
      return state.i < action.count - 1
        ? { ...state, i: state.i + 1, fl: false, busy: false }
        : { ...state, done: true, busy: false };
    case 'prev':
      return state.i > 0 ? { ...state, i: state.i - 1, fl: false, busy: false } : state;
    case 'finish':
      return { ...state, done: true, busy: false };
    case 'retake':
      return initialQuiz(state.sid, state.lid);
    default:
      return state;
  }
}
