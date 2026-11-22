import { useEffect, useRef } from 'react';
import Icon from './Icon';

export default function Modal({ title, subtitle, onClose, onSubmit, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    (dialog?.querySelector('[data-autofocus]') || dialog?.querySelector('.in') || dialog?.querySelector('button'))?.focus();
  }, []);

  useEffect(() => {
    // EVENT: keydown - Escape closes the modal and Tab stays inside it (document listener with cleanup)
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button,input,textarea')].filter((el) => !el.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      id="modal"
      onClick={(e) => {
        // EVENT: onClick - clicking the backdrop closes the modal
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mt" ref={dialogRef}>
        <form noValidate onSubmit={onSubmit}>
          <button type="button" className="x" onClick={onClose} aria-label="Close">
            {/* EVENT: onClick - close button */}
            <Icon name="plus" size={28} />
          </button>
          <div className="mh">
            <h2 id="mt">{title}</h2>
            <p>{subtitle}</p>
          </div>
          {children}
        </form>
      </div>
    </div>
  );
}
