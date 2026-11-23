import ItemCard from './ItemCard';

export default function CardGrid({ items, empty, onOpen, onEdit, selectMode = false, selectedIds = [], onToggle }) {
  return (
    <div className="grid">
      {items.length
        ? items.map((item) => (
            <ItemCard
              key={item.id}
              {...item}
              onOpen={onOpen}
              onEdit={onEdit}
              selectMode={selectMode}
              selected={selectedIds.includes(item.id)}
              onToggle={onToggle}
            />
          ))
        : <p className="empty">{empty}</p>}
    </div>
  );
}
