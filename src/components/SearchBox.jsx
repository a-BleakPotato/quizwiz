import searchUrl from '../assets/search.svg';

export default function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="search">
      <img className="search-icon" src={searchUrl} alt="" width="28" height="28" />
      <input
        className="in"
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)} // EVENT: onChange (input) - filter cards live while typing
      />
    </div>
  );
}
