import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Art';
import Icon from './Icon';
import { useApp } from '../AppContext';

export default function Header() {
  const { pathname } = useLocation();
  const { openModal } = useApp();
  const subjectMatch = pathname.match(/^\/subject\/([^/]+)/);
  const isHome = pathname === '/';
  const isSubject = Boolean(subjectMatch);
  const addButton = (label, modal) => (
    <button className="btn y" onClick={() => openModal(modal)}>
      {/* EVENT: onClick - ADD SUBJECT / ADD LESSON opens the matching modal */}
      <Icon name="plus" size={28} />ADD {label}
    </button>
  );

  return (
    <header>
      <div className="wrap">
        <Link to="/" className="logo" aria-label="QuizWiz home"><Logo /></Link>
        <div className="acts">
          {isSubject && (
            <button className="btn t" onClick={() => openModal({ type: 'subject', subjectId: subjectMatch[1] })}>
              {/* EVENT: onClick - EDIT edits the current subject */}
              EDIT
            </button>
          )}
          {isHome && addButton('SUBJECT', { type: 'subject' })}
          {isSubject && addButton('LESSON', { type: 'lesson', subjectId: subjectMatch[1] })}
        </div>
      </div>
    </header>
  );
}
