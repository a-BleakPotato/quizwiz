import Icon from './Icon';

export default function DeleteToggle({ label, active, onClick }) {
  return (
    <button
      type="button"
      className={`chip del${active ? ' on' : ''}`}
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
    >
      {/* EVENT: onClick - toggle multi-select mode for subjects or lessons */}
      <Icon name="trash" size={20} />
    </button>
  );
}
