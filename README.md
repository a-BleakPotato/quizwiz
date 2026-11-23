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
    DeleteToggle.jsx       red trash icon that toggles multi-select mode
    CardGrid.jsx           grid + empty states
    ItemCard.jsx           one card for subjects and lessons (selectable in delete mode)
    SelectionBar.jsx       bottom bar with the delete-selected button
    DeleteConfirm.jsx      "Are you sure?" confirmation modal
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

Every handler has a short `// EVENT:` comment. The `#/events` page renders the `EVENT_MAP` array in `src/events.js` (including the timer rows), and `console.table(EVENT_MAP)` runs from `App` on first mount. The full action-by-action map is in the next section.

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

## Event map — every user action and what it triggers

QuizWiz is event-driven rather than script-driven. React's `onClick`, `onChange` and `onSubmit` props are declarative listeners registered by React; the cases that need document/window access use `addEventListener` inside `useEffect` with a matching `removeEventListener` cleanup (Escape/Tab, outside clicks, arrow keys, cross-tab `storage`). Navigation is handled by `<HashRouter>` instead of a raw `hashchange` listener, and delayed work uses guarded `setTimeout`s. The event wiring is already aligned with modern event-driven practice, so no handler code needed changing — the tables below document it.

The same map is rendered as a table at `#/events` from `src/events.js` and printed with `console.table(EVENT_MAP)` when the app mounts.

### Navigation and browsing

| User action | Event / listener | What happens |
| --- | --- | --- |
| Click the QuizWiz logo or a Back link | React Router `<Link>` `onClick` | Navigates home; the route effect closes any open modal and scrolls to the top. |
| Click a subject card or its title | `onClick` in `ItemCard` | Navigates to `/subject/:subjectId`, showing that subject's lessons. |
| Click browser Back/Forward, or change the URL hash | `<HashRouter>` / `<Routes>` | Renders the matching view (dashboard, subject, quiz or event map), closes any modal and scrolls to the top. |
| Open `#/events` | Route render | Shows the in-app event table and the RESET SAMPLE DATA button. |
| Click RESET SAMPLE DATA | `onClick` + `window.confirm` | On OK, replaces the db with the seed data and navigates home; on Cancel, nothing changes. |
| Type in the subject or lesson search box | `onChange` in `SearchBox` | Filters the visible cards live without touching saved data. |

### Filtering, selecting and deleting

| User action | Event / listener | What happens |
| --- | --- | --- |
| Click the All Subjects chip | `onClick` in `SubjectToolbar` | Toggles the filter dropdown (`aria-expanded`). |
| Click a filter option | `onClick` on the menu item | Sets the filter, filters the grid and closes the dropdown. |
| Click outside the filter dropdown | `document` `click` listener (cleaned up) | Closes the dropdown. |
| Press Escape while the dropdown is open | `document` `keydown` listener (cleaned up) | Closes the dropdown. |
| Click the red trash icon next to search/filter | `onClick` in `DeleteToggle` | Enters multi-select mode, turns cards into checkboxes and shows the bottom selection bar. Clicking it again exits. |
| Click a subject/lesson card in select mode | `onClick` in `ItemCard` | Toggles that card's selection (red tick/outline) and updates the delete count. The EDIT pill is hidden while selecting. |
| Click CANCEL in the bottom bar | `onClick` in `SelectionBar` | Leaves select mode and clears the selection; nothing is deleted. |
| Click the bottom DELETE button | `onClick` in `SelectionBar` | Opens the "Are you sure?" modal; the button is disabled until at least one card is selected. |
| Click CANCEL, the X, the backdrop or press Escape in that modal | `onClick` / `document` `keydown` in `Modal` | Closes the confirmation and keeps the selection; nothing is deleted. |
| Click the red DELETE button, or press Enter | `onSubmit` in `DeleteConfirm` | Dispatches `delete-subjects` or `delete-lessons`, shows a toast, closes the modal and clears the selection. |

### Creating and editing

| User action | Event / listener | What happens |
| --- | --- | --- |
| Click ADD SUBJECT / ADD LESSON in the header | `onClick` in `Header` | Opens the empty add form in a modal. |
| Click EDIT on a card, or EDIT in the subject header | `onClick` in `ItemCard` / `Header` | Opens the same form prefilled with that subject or lesson. |
| Type in a title, description, question or answer field | `onChange` in `SubjectForm` / `LessonForm` | Updates form state and clears that field's inline validation error. |
| Click ADD CARD | `onClick` in `LessonForm` | Appends a card row, scrolls to it and focuses its question input. |
| Click a card row's trash icon | `onClick` in `LessonForm` | Removes that row (disabled when only one card remains). |
| Click SAVE / ADD LESSON, or press Enter | `onSubmit` of the modal form | Validates, dispatches `add-subject`/`edit-subject` or `add-lesson`/`edit-lesson`, shows a toast and closes; invalid fields show inline errors. |
| Click CANCEL in a form | `onClick` in `SubjectForm` / `LessonForm` | Closes the modal without saving. |

### Quiz and results

| User action | Event / listener | What happens |
| --- | --- | --- |
| Click a lesson card | `onClick` in `ItemCard` | Opens the "Start quiz?" confirmation modal. |
| Click START QUIZ, or press Enter | `onSubmit` in `StartQuizConfirm` | Closes the modal, navigates to `/quiz/:subjectId/:lessonId` and starts a fresh quiz session. |
| Click anywhere on a flashcard face (or its invisible hit button) | `onClick` in `Flashcards` | Flips between question and answer with a CSS 3D flip; the hidden face is inert. |
| Click HARD or MASTERED | `onClick` in `Flashcards` (`stopPropagation`) | Saves the rating to the db immediately, highlights the choice and schedules auto-advance; the card does not flip. |
| About 350 ms after a rating | `setTimeout` in `rate()` | Advances to the next card, or goes to Results on the last one; stale timers are cancelled on navigation. |
| Click PREV, or press ArrowLeft | `onClick` / global `keydown` | Moves to the previous card (PREV is disabled on the first card). |
| Click NEXT, or press ArrowRight | `onClick` / global `keydown` | Moves forward; on the last card the button reads FINISH. |
| Click FINISH | `onClick` in `Flashcards` | Writes the score/time to `last` and shows the Results page. |
| Click RETAKE | `onClick` in `Results` | Resets the local quiz session and starts again. |
| Press Arrow keys while a modal is open, results are shown or an input is focused | `keydown` guard in `Flashcards` | Ignored, so navigation does not happen at the wrong time. |

### Dialogs, keyboard, timers and window events

| Action / trigger | Event / listener | What happens |
| --- | --- | --- |
| Click any modal's X, its backdrop or CANCEL | `onClick` in `Modal` and form components | Closes the modal, unlocks page scrolling and returns focus to the element that opened it. |
| Press Escape in a modal | `document` `keydown` listener with cleanup | Closes the modal (same cleanup as above). |
| Press Tab / Shift+Tab in a modal | `document` `keydown` listener with cleanup | Focus is trapped inside the dialog until it closes. |
| A modal opens / closes | `useEffect` in `ModalHost` | Adds/removes `body.lock` so the page behind cannot scroll. |
| The db changes (add, edit, rate, delete, reset) | `useEffect` in `App` | Saves to `localStorage`; shows a toast if storage fails. |
| Another tab changes `localStorage` | `window` `storage` listener with cleanup | Reloads and re-renders the db, except while a modal is open or a quiz is in progress. |
| A save/delete succeeds | `showToast` + `setTimeout` in `ToastProvider` | Shows a status message that auto-dismisses after about 2.4 s. |
| The app first mounts | `useEffect` in `App` | Loads the db from `localStorage`, renders the first view and logs `EVENT_MAP` with `console.table`. |

## Notes / things worth knowing

- Ratings write `card.st` to `db` immediately; `last` is written when the quiz finishes. Search/filter text is `useState` and is never saved.
- Entering a quiz route always creates a new session. The auto-advance timer is cancelled on unmount and guarded with a navigation token, so navigating away cannot leave a stale timer.
- Three quirks from the original are worth flagging rather than copying silently:
  1. Clicking the *text* on a flashcard did not flip it (the text sat above the invisible click button). The React version handles the click on the card face, so clicking anywhere flips it as intended.
  2. The original auto-advance timer could still fire after you moved to another card and back within 350 ms. The React version guards against this.
  3. The original drops a `storage` event that arrives while a modal is open, and the tab stays stale after the modal closes. That is preserved because the spec says syncing is disabled while a modal is open; a follow-up change in the other tab syncs it again.
- Exported assets are used untouched. `Halftone.svg` renders at its native 460×538 twice per card/results face: the left copy is pinned to `left:0`, the right copy to `right:0` and mirrored, so the dark/large dots sit at each card edge and fade inward. `Hero Bg.svg` at 471×295; `Logo.svg` at 201×48; subject art at 286×329 cropped by the 290×307 card.
- The **lesson card line/dot art (#6)** was not in the export, so `LessonArt` in `src/components/Art.jsx` still contains the original placeholder drawing. Drop the exported SVG into `Assets/` and `src/assets/`, import it there, and replace that one component when it arrives. Optional icons other than `search.svg` also remain inline.
- Subject and lesson deletion: the red trash icon next to search/filter turns cards into multi-select checkboxes; the bottom bar deletes the selection after an "Are you sure?" confirmation. Out of scope: login, backend and settings page.
