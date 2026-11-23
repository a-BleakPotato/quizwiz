import Icon from './Icon';

export default function ItemCard({ id, art, tag, name, p, kind, onOpen, onEdit, selectMode = false, selected = false, onToggle = () => {} }) {
  return (
    <article
      className={`card${selectMode ? ' selecting' : ''}${selected ? ' selected' : ''}`}
      onClick={() => (selectMode ? onToggle(id) : onOpen(id))}
      /* EVENT: onClick - open the card, or toggle its selection in delete mode */
    >
      {art}
      {selectMode ? (
        <span className="sel-box" aria-hidden="true">{selected && <Icon name="ok" size={20} color="#fff" />}</span>
      ) : (
        <button
          type="button"
          className="pill"
          onClick={(e) => {
            // EVENT: onClick - EDIT opens the modal without opening the card
            e.stopPropagation();
            onEdit(id);
          }}
        >
          EDIT
        </button>
      )}
      <div className="meta">
        <span className="tag">{tag}</span>
        <h3>
          <button
            type="button"
            className="open"
            aria-label={selectMode ? `${selected ? 'Deselect' : 'Select'} ${name}` : undefined}
            aria-pressed={selectMode ? selected : undefined}
            onClick={selectMode ? (e) => { e.stopPropagation(); onToggle(id); } : undefined}
          >
            {name}
          </button>
        </h3>
      </div>
      <div className="mast">
        <div><span>Mastery Level</span><span>{p}%</span></div>
        <div className="track"><b style={{ width: `${p}%` }} /></div>
      </div>
    </article>
  );
}
