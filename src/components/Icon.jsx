/* Inline icons kept from the original file (the optional icon export was not supplied). */

const PATHS = {
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></>,
  filter: <path d="M4 7h16M7 12h10M10 17h4" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  back: <path d="M20 12H4m6-6-6 6 6 6" />,
  trash: <path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" />,
  ok: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  no: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
};

export default function Icon({ name, size = 24, color = '#000' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
