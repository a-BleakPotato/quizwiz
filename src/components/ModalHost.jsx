import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectForm from './SubjectForm';
import LessonForm from './LessonForm';
import StartQuizConfirm from './StartQuizConfirm';
import { useApp } from '../AppContext';
import { useToast } from '../Toast';

export default function ModalHost() {
  const { db, dispatch, modal, closeModal } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const subject = modal?.subjectId ? db.subjects.find((s) => s.id === modal.subjectId) : null;
  const lesson = modal?.lessonId ? subject?.lessons.find((l) => l.id === modal.lessonId) : null;
  const invalid = modal && (
    (modal.type === 'subject' && modal.subjectId && !subject) ||
    (modal.type === 'lesson' && (!subject || (modal.lessonId && !lesson))) ||
    (modal.type === 'start' && (!subject || !lesson))
  );

  useEffect(() => {
    if (invalid) closeModal();
  }, [invalid, closeModal]);

  useEffect(() => {
    if (!modal) return;
    document.body.classList.add('lock');
    return () => document.body.classList.remove('lock');
  }, [modal]);

  if (!modal || invalid) return null;

  const saveSubject = ({ name, desc }) => {
    if (modal.subjectId) {
      dispatch({ type: 'edit-subject', id: modal.subjectId, name, desc });
      showToast('Subject saved');
    } else {
      dispatch({ type: 'add-subject', name, desc });
      showToast('Subject added');
    }
    closeModal();
  };

  const saveLesson = ({ name, cards }) => {
    const edit = Boolean(modal.lessonId);
    if (edit) dispatch({ type: 'edit-lesson', sid: modal.subjectId, id: modal.lessonId, name, cards });
    else dispatch({ type: 'add-lesson', sid: modal.subjectId, name, cards });
    showToast(edit ? 'Lesson saved' : 'Lesson added');
    closeModal();
  };

  if (modal.type === 'subject') {
    return <SubjectForm subject={subject} onClose={closeModal} onSave={saveSubject} />;
  }

  if (modal.type === 'lesson') {
    return <LessonForm lesson={lesson} onClose={closeModal} onSave={saveLesson} />;
  }

  return (
    <StartQuizConfirm
      lesson={lesson}
      onClose={closeModal}
      onStart={() => {
        closeModal();
        navigate(`/quiz/${modal.subjectId}/${modal.lessonId}`);
      }}
    />
  );
}
