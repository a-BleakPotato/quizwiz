/* Event map for the Event-Driven Programming class project.
   Rendered by <EventMap> and printed once with console.table when App mounts. */

export const EVENT_MAP = [
  ['mount', 'App first mounts (replaces DOMContentLoaded)', 'useEffect in App', 'Load localStorage, render the first view and console.table(EVENT_MAP)'],
  ['Router', 'URL hash changes (card click, Back link, browser Back)', '<HashRouter> / <Routes> (replaces hashchange)', 'Swap dashboard, subject, quiz and event map; close modal and scroll to top'],
  ['onClick', 'ADD SUBJECT / ADD LESSON / EDIT buttons', 'Header / ItemCard onClick', 'Open the add or edit modal'],
  ['onClick', 'Subject card', 'ItemCard onClick', 'Go to the subject page'],
  ['onClick', 'Lesson card', 'ItemCard onClick', 'Open the "Start quiz?" modal; START QUIZ navigates to the quiz'],
  ['onClick', 'All Subjects chip and its menu items', 'Dashboard chip/menu onClick', 'Open the menu and filter the grid'],
  ['onClick', 'ADD CARD / trash icon in the lesson modal', 'LessonForm onClick', 'Append a card input (list scrolls) or remove one'],
  ['onClick', 'Flashcard face', 'Flashcards onClick', 'Flip between question and answer (CSS 3D flip; hidden face is inert)'],
  ['onClick', 'HARD / MASTERED', 'Flashcards rateCard', 'Save the card status to db immediately and update mastery'],
  ['setTimeout', 'HARD / MASTERED rating, about 350ms later', 'Flashcards timer in rateCard', 'Auto-advance to the next card, or go straight to Results on the last card'],
  ['onClick', 'PREV / NEXT / FINISH / RETAKE', 'Flashcards onClick', 'Move between cards, show results, restart'],
  ['onClick', 'Outside the menu or modal / backdrop', 'document listener + Modal onClick', 'Close the filter menu or the modal; return focus to the opener'],
  ['onChange (input)', 'Search boxes', 'Dashboard / SubjectPage onChange', 'Filter cards live while typing'],
  ['onSubmit', 'Subject, lesson and start-quiz forms', 'Modal <form> onSubmit', 'Validate, save, re-render or navigate (Enter also submits)'],
  ['onKeyDown', 'Escape / Tab in a modal, Arrow keys on flashcards', 'Modal document listener + Flashcards listener', 'Close modal/menu, trap Tab in modal, previous/next card'],
  ['storage', 'Another tab changes localStorage', 'App window.addEventListener', 'Reload db and re-render, except while a quiz or modal is open'],
];
