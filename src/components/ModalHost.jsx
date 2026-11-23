import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectForm from './SubjectForm';
import LessonForm from './LessonForm';
import StartQuizConfirm from './StartQuizConfirm';
import DeleteConfirm from './DeleteConfirm';
import { useApp } from '../AppContext';
import { useToast } from '../Toast';

export default function ModalHost() {
  const { db, dispatch, modal, closeModal } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const subject = modal?.subjectId ? db.subjects.find((s) => s.id === modal.subjectId) : null;
  const lesson = modal?.lessonId ? subject?.lessons.find((l) => l.id === modal.lessonId) : null;
  const isLessonDelete = modal?.type === 'delete' && modal.kind === 'lesson';
  const deleteInvalid = modal?.type === 'delete' && (
    !Array.isArray(modal.ids) || !modal.ids.length ||
    (isLessonDelete
      ? (!subject || modal.ids.some((id) => !subject.lessons.some((l) => l.id === id)))
      : modal.ids.some((id) => !db.subjects.some((s) => s.id === id)))
  );
  const invalid = modal && (
    (modal.type === 'subject' && modal.subjectId && !subject) ||
    (modal.type === 'lesson' && (!subject || (modal.lessonId && !lesson))) ||
    (modal.type === 'start' && (!subject || !lesson)) ||
    deleteInvalid
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

  if (modal.type === 'delete') {
    const count = modal.ids.length;
    return (
      <DeleteConfirm
        kind={modal.kind}
        count={count}
        onClose={closeModal}
        onDelete={() => {
          // EVENT: onSubmit - remove every selected subject or lesson from the db
          if (isLessonDelete) dispatch({ type: 'delete-lessons', sid: modal.subjectId, ids: modal.ids });
          else dispatch({ type: 'delete-subjects', ids: modal.ids });
          const noun = isLessonDelete ? 'lesson' : 'subject';
          showToast(`${count} ${noun}${count === 1 ? '' : 's'} deleted`);
          closeModal();
          modal.onDeleted?.();
        }}
      />
    );
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
