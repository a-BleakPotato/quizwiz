import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import SubjectToolbar from '../components/SubjectToolbar';
import CardGrid from '../components/CardGrid';
import { SubjectArt } from '../components/Art';
import { useApp } from '../AppContext';
import { pct } from '../data';
import useDocumentTitle from '../useDocumentTitle';

export default function Dashboard() {
  useDocumentTitle('QuizWiz');
  const navigate = useNavigate();
  const { db, subjectQuery, setSubjectQuery, filter, setFilter, openModal } = useApp();

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
        />
      </div>
      <CardGrid
        items={items}
        empty={db.subjects.length ? 'No subjects match your search or filter.' : 'No subjects yet. Select Add Subject to create one.'}
        onOpen={(id) => navigate(`/subject/${id}`)} // EVENT: onClick - open a subject
        onEdit={(id) => openModal({ type: 'subject', subjectId: id })} // EVENT: onClick - edit a subject
      />
    </div>
  );
}
