import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import SearchBox from '../components/SearchBox';
import DeleteToggle from '../components/DeleteToggle';
import CardGrid from '../components/CardGrid';
import SelectionBar from '../components/SelectionBar';
import { LessonArt } from '../components/Art';
import { useApp } from '../AppContext';
import { pct } from '../data';
import useDocumentTitle from '../useDocumentTitle';

export default function SubjectPage() {
  const { subjectId } = useParams();
  const { db, openModal } = useApp();
  const [lessonQuery, setLessonQuery] = useState('');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const subject = db.subjects.find((s) => s.id === subjectId);
  useDocumentTitle(subject ? `${subject.name} - QuizWiz` : 'QuizWiz');

  if (!subject) return <Navigate to="/" replace />;

  const query = lessonQuery.trim().toLowerCase();
  const list = subject.lessons
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => l.name.toLowerCase().includes(query));

  const items = list.map(({ l, i }) => ({
    id: l.id,
    kind: 'lesson',
    tag: `${l.cards.length} Card${l.cards.length === 1 ? '' : 's'}`,
    name: l.name,
    p: pct([l]),
    art: <LessonArt index={i} />,
  }));

  const cancelSelect = () => {
    setSelectMode(false);
    setSelectedIds([]);
  };

  const toggleSelectMode = () => {
    // EVENT: onClick - enter lesson delete mode, or leave it and clear the selection
    if (selectMode) cancelSelect();
    else { setSelectedIds([]); setSelectMode(true); }
  };

  const toggleSelected = (id) => {
    // EVENT: onClick - select or deselect a lesson card in delete mode
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  };

  return (
    <div className="wrap">
      <Link to="/" className="back"><Icon name="back" size={25} />Back</Link>
      <div className="sh">
        <div>
          <h1>{subject.name}</h1>
          <p>{subject.desc}</p>
        </div>
        <div className="sh-tools">
          <SearchBox value={lessonQuery} onChange={setLessonQuery} placeholder="Search by Lesson name" />
          <DeleteToggle label="Delete lessons" active={selectMode} onClick={toggleSelectMode} />
        </div>
      </div>
      <CardGrid
        items={items}
        empty={subject.lessons.length ? 'No lessons match your search.' : 'No lessons yet. Select Add Lesson to create one.'}
        onOpen={(id) => openModal({ type: 'start', subjectId: subject.id, lessonId: id })} // EVENT: onClick - open the start-quiz confirmation
        onEdit={(id) => openModal({ type: 'lesson', subjectId: subject.id, lessonId: id })} // EVENT: onClick - edit a lesson
        selectMode={selectMode}
        selectedIds={selectedIds}
        onToggle={toggleSelected}
      />
      {selectMode && (
        <SelectionBar
          kind="lesson"
          count={selectedIds.length}
          onCancel={cancelSelect}
          onDelete={() => openModal({
            type: 'delete',
            kind: 'lesson',
            subjectId: subject.id,
            ids: selectedIds,
            onDeleted: cancelSelect,
          })}
        />
      )}
    </div>
  );
}
