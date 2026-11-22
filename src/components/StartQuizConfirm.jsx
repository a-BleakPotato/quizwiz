import Modal from './Modal';

export default function StartQuizConfirm({ lesson, onClose, onStart }) {
  const n = lesson.cards.length;
  return (
    <Modal
      title="Start quiz?"
      subtitle={`${lesson.name} has ${n} card${n === 1 ? '' : 's'}. Flip each card, then mark it Hard or Mastered.`}
      onClose={onClose}
      onSubmit={(e) => {
        // EVENT: onSubmit - start the quiz for this lesson (Enter also submits)
        e.preventDefault();
        onStart();
      }}
    >
      <div className="foot">
        <button type="button" className="btn" onClick={onClose}>
          {/* EVENT: onClick - cancel */}
          CANCEL
        </button>
        <button className="btn t" data-autofocus>START QUIZ</button>
      </div>
    </Modal>
  );
}
