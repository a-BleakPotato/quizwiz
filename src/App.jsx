import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Header from './components/Header';
import ModalHost from './components/ModalHost';
import Dashboard from './pages/Dashboard';
import SubjectPage from './pages/SubjectPage';
import Flashcards from './pages/Flashcards';
import EventMap from './pages/EventMap';
import { AppContext, useApp } from './AppContext';
import { ToastProvider, ToastViewport, useToast } from './Toast';
import { EVENT_MAP } from './events';
import { KEY, dbReducer, loadDb, readStorageValue, saveDb } from './data';

function QuizRoute() {
  const { subjectId, lessonId } = useParams();
  const { db } = useApp();
  const valid = db.subjects.some((s) => s.id === subjectId && s.lessons.some((l) => l.id === lessonId && l.cards.length));
  // Keying by ids guarantees a fresh quiz session every time a quiz route is entered.
  return valid
    ? <Flashcards key={`${subjectId}/${lessonId}`} subjectId={subjectId} lessonId={lessonId} />
    : <Navigate to="/" replace />;
}

function AppShell() {
  const location = useLocation();
  const [db, dispatchDb] = useReducer(dbReducer, undefined, loadDb);
  const [subjectQuery, setSubjectQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const modalRef = useRef(null);
  const pathRef = useRef(location.pathname);
  pathRef.current = location.pathname;
  const { showToast } = useToast();

  const openModal = useCallback((spec) => {
    const next = { ...spec, opener: document.activeElement };
    modalRef.current = next;
    setModal(next);
  }, []);

  const closeModal = useCallback(() => {
    const current = modalRef.current;
    modalRef.current = null;
    setModal(null);
    if (current?.opener?.isConnected) current.opener.focus();
  }, []);

  useEffect(() => {
    if (!saveDb(db)) showToast('Could not save. Browser storage may be full or blocked.');
  }, [db, showToast]);

  useEffect(() => {
    // EVENT: DOMContentLoaded is replaced by mount: load db, render the first view and print the event map.
    console.table(EVENT_MAP);
  }, []);

  useEffect(() => {
    // EVENT: hashchange is handled by <HashRouter>/<Routes>: close any modal and scroll to top on route change.
    closeModal();
    window.scrollTo(0, 0);
  }, [location.pathname, closeModal]);

  useEffect(() => {
    // EVENT: storage - another tab changed the saved db (real window listener, with cleanup).
    const onStorage = (e) => {
      if (e.key !== KEY || modalRef.current || pathRef.current.startsWith('/quiz')) return;
      const next = readStorageValue(e.newValue);
      if (next) dispatchDb({ type: 'replace', db: next });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(() => ({
    db,
    dispatch: dispatchDb,
    modal,
    openModal,
    closeModal,
    subjectQuery,
    setSubjectQuery,
    filter,
    setFilter,
  }), [db, modal, openModal, closeModal, subjectQuery, filter]);

  return (
    <AppContext.Provider value={value}>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/subject/:subjectId" element={<SubjectPage />} />
        <Route path="/quiz/:subjectId/:lessonId" element={<QuizRoute />} />
        <Route path="/events" element={<EventMap />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ModalHost />
      <ToastViewport />
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </ToastProvider>
  );
}
