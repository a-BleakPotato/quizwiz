import { useRef, useState } from 'react';
import Modal from './Modal';

export default function SubjectForm({ subject, onClose, onSave }) {
  const [title, setTitle] = useState(subject?.name || '');
  const [desc, setDesc] = useState(subject?.desc || '');
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  const submit = (e) => {
    // EVENT: onSubmit - validate and save the subject (Enter also submits)
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError('Enter a subject title.');
      titleRef.current?.focus();
      return;
    }
    onSave({ name: t, desc: desc.trim() });
  };

  return (
    <Modal
      title={subject ? 'Edit Subject' : 'Add Subject'}
      subtitle={subject ? 'Modify current subject' : 'Add a subject'}
      onClose={onClose}
      onSubmit={submit}
    >
      <div className="fld">
        <label className="lb" htmlFor="f1">Subject Title:</label>
        <input
          ref={titleRef}
          className="in"
          id="f1"
          name="t"
          maxLength={40}
          placeholder="Add subject title"
          value={title}
          onChange={(e) => {
            // EVENT: onChange (input) - update title and clear its inline error
            setTitle(e.target.value);
            setError('');
          }}
        />
        <p className="err" role="alert">{error}</p>
      </div>
      <div className="fld">
        <label className="lb" htmlFor="f2">Subject Description: <em>Optional</em></label>
        <textarea
          className="in"
          id="f2"
          name="d"
          maxLength={160}
          placeholder="Brief description of subject"
          value={desc}
          onChange={(e) => setDesc(e.target.value)} // EVENT: onChange (input) - update description
        />
      </div>
      <div className="foot">
        <button type="button" className="btn" onClick={onClose}>
          {/* EVENT: onClick - cancel */}
          CANCEL
        </button>
        <button className="btn t">{subject ? 'SAVE' : 'ADD SUBJECT'}</button>
      </div>
    </Modal>
  );
}
