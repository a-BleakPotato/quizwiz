export default function ItemCard({ id, art, tag, name, p, kind, onOpen, onEdit }) {
  return (
    <article
      className="card"
      onClick={() => onOpen(id)}
      /* EVENT: onClick - the whole subject/lesson card opens it */
    >
      {art}
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
      <div className="meta">
        <span className="tag">{tag}</span>
        <h3><button type="button" className="open">{name}</button></h3>
      </div>
      <div className="mast">
        <div><span>Mastery Level</span><span>{p}%</span></div>
        <div className="track"><b style={{ width: `${p}%` }} /></div>
      </div>
    </article>
  );
}
