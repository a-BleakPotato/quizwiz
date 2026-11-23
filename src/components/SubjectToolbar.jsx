import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import SearchBox from './SearchBox';
import DeleteToggle from './DeleteToggle';
import { FILTERS } from '../data';

export default function SubjectToolbar({ query, setQuery, filter, setFilter, deleteActive, onDeleteToggle }) {
  const [open, setOpen] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // EVENT: click outside the filter dropdown closes it (document listener with cleanup)
    const onOutside = (e) => {
      if (!ddRef.current?.contains(e.target)) setOpen(false);
    };
    // EVENT: keydown Escape closes the filter dropdown (document listener with cleanup)
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="tools">
      <SearchBox value={query} onChange={setQuery} placeholder="Search by subject name" />
      <div className="dd" ref={ddRef}>
        <button
          type="button"
          className="chip"
          aria-haspopup="true"
          aria-expanded={open}
          onClick={() => setOpen((wasOpen) => !wasOpen)} // EVENT: onClick - toggle the filter dropdown
        >
          <Icon name="filter" size={20} />
          <span>{FILTERS[filter]}</span>
        </button>
        <div className="menu" role="menu" hidden={!open}>
          {Object.entries(FILTERS).map(([key, label]) => (
            <button
              type="button"
              key={key}
              role="menuitemradio"
              aria-checked={key === filter}
              onClick={() => {
                // EVENT: onClick - choose a subject filter and close the dropdown
                setFilter(key);
                setOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <DeleteToggle label="Delete subjects" active={deleteActive} onClick={onDeleteToggle} />
    </div>
  );
}
