import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import SubjectToolbar from '../components/SubjectToolbar';
import CardGrid from '../components/CardGrid';
import SelectionBar from '../components/SelectionBar';
import { SubjectArt } from '../components/Art';
import { useApp } from '../AppContext';
import { pct } from '../data';
import useDocumentTitle from '../useDocumentTitle';

export default function Dashboard() {
  useDocumentTitle('QuizWiz');
  const navigate = useNavigate();
  const { db, subjectQuery, setSubjectQuery, filter, setFilter, openModal } = useApp();
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const query = subjectQuery.trim().toLowerCase();
  const list = db.subjects
    .map((s, i) => ({ s, i, p: pct(s.lessons) }))
    .filter(({ s, p }) =>
      s.name.toLowerCase().includes(query) &&
      (filter === 'all' ||
        (filter === 'prog' && p > 0 && p < 100) ||
        (filter === 'new' && p === 0) ||
        (filter === 'done' && p === 100))
    );

  const items = list.map(({ s, i, p }) => ({
    id: s.id,
    kind: 'subject',
    tag: `Deck ${String(i + 1).padStart(2, '0')}`,
    name: s.name,
    p,
    art: <SubjectArt index={i} />,
  }));

  const cancelSelect = () => {
    setSelectMode(false);
    setSelectedIds([]);
  };

  const toggleSelectMode = () => {
    // EVENT: onClick - enter subject delete mode, or leave it and clear the selection
    if (selectMode) cancelSelect();
    else { setSelectedIds([]); setSelectMode(true); }
  };

  const toggleSelected = (id) => {
    // EVENT: onClick - select or deselect a subject card in delete mode
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  };

  return (
    <div className="wrap">
      <Hero />
      <div className="sec">
        <h2>My Subjects</h2>
        <SubjectToolbar
          query={subjectQuery}
          setQuery={setSubjectQuery}
          filter={filter}
          setFilter={setFilter}
          deleteActive={selectMode}
          onDeleteToggle={toggleSelectMode}
        />
      </div>
      <CardGrid
        items={items}
        empty={db.subjects.length ? 'No subjects match your search or filter.' : 'No subjects yet. Select Add Subject to create one.'}
        onOpen={(id) => navigate(`/subject/${id}`)} // EVENT: onClick - open a subject
        onEdit={(id) => openModal({ type: 'subject', subjectId: id })} // EVENT: onClick - edit a subject
        selectMode={selectMode}
        selectedIds={selectedIds}
        onToggle={toggleSelected}
      />
      {selectMode && (
        <SelectionBar
          kind="subject"
          count={selectedIds.length}
          onCancel={cancelSelect}
          onDelete={() => openModal({ type: 'delete', kind: 'subject', ids: selectedIds, onDeleted: cancelSelect })}
        />
      )}
    </div>
  );
}
