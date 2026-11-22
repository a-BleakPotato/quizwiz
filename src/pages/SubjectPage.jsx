import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import SearchBox from '../components/SearchBox';
import CardGrid from '../components/CardGrid';
import { LessonArt } from '../components/Art';
import { useApp } from '../AppContext';
import { pct } from '../data';
import useDocumentTitle from '../useDocumentTitle';

export default function SubjectPage() {
  const { subjectId } = useParams();
  const { db, openModal } = useApp();
  const [lessonQuery, setLessonQuery] = useState('');
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

  return (
    <div className="wrap">
      <Link to="/" className="back"><Icon name="back" size={25} />Back</Link>
      <div className="sh">
        <div>
          <h1>{subject.name}</h1>
          <p>{subject.desc}</p>
        </div>
        <SearchBox value={lessonQuery} onChange={setLessonQuery} placeholder="Search by Lesson name" />
      </div>
      <CardGrid
        items={items}
        empty={subject.lessons.length ? 'No lessons match your search.' : 'No lessons yet. Select Add Lesson to create one.'}
        onOpen={(id) => openModal({ type: 'start', subjectId: subject.id, lessonId: id })} // EVENT: onClick - open the start-quiz confirmation
        onEdit={(id) => openModal({ type: 'lesson', subjectId: subject.id, lessonId: id })} // EVENT: onClick - edit a lesson
      />
    </div>
  );
}
