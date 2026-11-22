import ItemCard from './ItemCard';

export default function CardGrid({ items, empty, onOpen, onEdit }) {
  return (
    <div className="grid">
      {items.length
        ? items.map((item) => (
            <ItemCard
              key={item.id}
              {...item}
              onOpen={onOpen}
              onEdit={onEdit}
            />
          ))
        : <p className="empty">{empty}</p>}
    </div>
  );
}
