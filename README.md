# QuizWiz (React migration)

Frontend-only flashcard app for **Event-Driven Programming**. No login, no backend; all data lives in `localStorage` under `quizwiz.v1`.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/#/`). `npm run build` makes a production build in `dist/`; `npm run preview` serves it.

The original reference file is kept at `quizwiz.html` for side-by-side comparison. The exported art lives in `Assets/` and is copied (unmodified) into `src/assets/` and imported from there.

## Folder structure

```
src/
  main.jsx                 React root
  App.jsx                  providers, HashRouter, db reducer, save/storage/route effects
  AppContext.js            shared db / modal / UI context
  data.js                  schema, seed data, validation, db reducer, mastery math
  events.js                EVENT_MAP rendered at /events and console.table'd on mount
  quizReducer.js           local quiz session (index, flip, results, timing, done)
  styles.css               original CSS with asset-swap rules
  Toast.jsx                toast provider + viewport
  useDocumentTitle.js      document.title per page
  components/
    Header.jsx             logo + route-dependent buttons
    Hero.jsx               hero copy, stats, highlighter, hero art
    SubjectToolbar.jsx     live search + filter dropdown
    SearchBox.jsx          shared search input + exported search icon
    CardGrid.jsx           grid + empty states
    ItemCard.jsx           one card for subjects and lessons
    Art.jsx                imported SVG assets + the still-pending lesson-art placeholder
    Icon.jsx               inline icons from the original file
    Modal.jsx              shared dialog shell: focus trap, Escape, backdrop, focus return
    SubjectForm.jsx        subject add/edit
    LessonForm.jsx         lesson add/edit with card rows
    StartQuizConfirm.jsx   "Start quiz?" confirmation
    ModalHost.jsx          chooses the modal, dispatches db updates and toasts
  pages/
    Dashboard.jsx          / — hero, stats, search/filter, subject cards
    SubjectPage.jsx        /subject/:subjectId — lesson cards, search
    Flashcards.jsx         /quiz/:subjectId/:lessonId — quiz session
    Results.jsx            score, duration, accuracy, breakdown, retake
    EventMap.jsx           /events — EVENT_MAP table + reset sample data
```

## Where the events are handled

Every handler has a short `// EVENT:` comment. The `/events` page renders the `EVENT_MAP` array in `src/events.js` (including the added `setTimeout` auto-advance row), and `console.table(EVENT_MAP)` runs from `App` on first mount.

| Event | Where |
| --- | --- |
| `onClick` cards / EDIT / header buttons | `ItemCard.jsx`, `Header.jsx`, `Dashboard.jsx`, `SubjectPage.jsx` |
| `onClick` filter chip/menu, outside click | `SubjectToolbar.jsx` (document listener with cleanup) |
| `onClick` add/delete card, cancel, close, backdrop | `LessonForm.jsx`, `Modal.jsx`, `ModalHost.jsx` |
| `onClick` flip / rate / PREV / NEXT / FINISH / RETAKE | `Flashcards.jsx`, `Results.jsx` |
| `setTimeout` auto-advance (~350 ms) | `Flashcards.jsx` `rate()` |
| `onChange` (input) searches and form fields | `SearchBox.jsx`, `SubjectForm.jsx`, `LessonForm.jsx` |
| `onSubmit` forms | `SubjectForm.jsx`, `LessonForm.jsx`, `StartQuizConfirm.jsx` |
| `onKeyDown` Escape / Tab trap | `Modal.jsx` (document listener with cleanup) |
| global `keydown` ArrowLeft/ArrowRight | `Flashcards.jsx` (window listener with cleanup) |
| `storage` (other tabs) | `App.jsx` (window listener with cleanup; skipped during quiz/modal) |
| `hashchange` | replaced by `<HashRouter>`/`<Routes>` in `App.jsx`; route effect closes modals and scrolls to top |
| `DOMContentLoaded` | replaced by the mount effect in `App.jsx` |

## Notes / things worth knowing

- Ratings write `card.st` to `db` immediately; `last` is written when the quiz finishes. Search/filter text is `useState` and is never saved.
- Entering a quiz route always creates a new session. The auto-advance timer is cancelled on unmount and guarded with a navigation token, so navigating away cannot leave a stale timer.
- Three quirks from the original are worth flagging rather than copying silently:
  1. Clicking the *text* on a flashcard did not flip it (the text sat above the invisible click button). The React version handles the click on the card face, so clicking anywhere flips it as intended.
  2. The original auto-advance timer could still fire after you moved to another card and back within 350 ms. The React version guards against this.
  3. The original drops a `storage` event that arrives while a modal is open, and the tab stays stale after the modal closes. That is preserved because the spec says syncing is disabled while a modal is open; a follow-up change in the other tab syncs it again.
- Exported assets are used untouched. `Halftone.svg` renders at its native 460×538 twice per card/results face: the left copy is pinned to `left:0`, the right copy to `right:0` and mirrored, so the dark/large dots sit at each card edge and fade inward. `Hero Bg.svg` at 471×295; `Logo.svg` at 201×48; subject art at 286×329 cropped by the 290×307 card.
- The **lesson card line/dot art (#6)** was not in the export, so `LessonArt` in `src/components/Art.jsx` still contains the original placeholder drawing. Drop the exported SVG into `Assets/` and `src/assets/`, import it there, and replace that one component when it arrives. Optional icons other than `search.svg` also remain inline.
- Out of scope as requested: login, backend, settings page, and subject/lesson deletion.
