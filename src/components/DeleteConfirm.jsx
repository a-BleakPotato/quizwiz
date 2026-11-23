import Modal from './Modal';

export default function DeleteConfirm({ kind, count, onClose, onDelete }) {
  const noun = kind === 'lesson' ? 'lesson' : 'subject';
  return (
    <Modal
      title="Are you sure?"
      subtitle="Changes cannot be undone."
      onClose={onClose}
      onSubmit={(e) => {
        // EVENT: onSubmit - remove the selected subjects/lessons (Enter also confirms)
        e.preventDefault();
        onDelete();
      }}
    >
      <div className="foot">
        <button type="button" className="btn" onClick={onClose}>
          {/* EVENT: onClick - cancel deletion */}
          CANCEL
        </button>
        <button type="submit" className="btn r" data-autofocus>
          DELETE {count} {noun.toUpperCase()}{count === 1 ? '' : 'S'}
        </button>
      </div>
    </Modal>
  );
}
