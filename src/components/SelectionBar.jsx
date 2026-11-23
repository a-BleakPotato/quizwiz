import Icon from './Icon';

export default function SelectionBar({ kind, count, onCancel, onDelete }) {
  const noun = kind === 'lesson' ? 'lesson' : 'subject';
  return (
    <div className="bulk-bar" role="region" aria-label={`Delete ${noun}s`}>
      <span className="bulk-count">{count ? `${count} selected` : `Select ${noun}s to delete`}</span>
      <button type="button" className="btn" onClick={onCancel}>
        {/* EVENT: onClick - leave multi-select mode without deleting */}
        CANCEL
      </button>
      <button type="button" className="btn r" disabled={!count} onClick={onDelete}>
        {/* EVENT: onClick - open the delete confirmation modal */}
        <Icon name="trash" size={24} />DELETE {count} {noun.toUpperCase()}{count === 1 ? '' : 'S'}
      </button>
    </div>
  );
}
