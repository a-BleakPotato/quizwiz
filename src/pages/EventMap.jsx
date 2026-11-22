import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { EVENT_MAP } from '../events';
import { SEED } from '../data';
import { useApp } from '../AppContext';
import useDocumentTitle from '../useDocumentTitle';

export default function EventMap() {
  useDocumentTitle('Event map - QuizWiz');
  const { dispatch } = useApp();
  const navigate = useNavigate();

  return (
    <div className="wrap">
      <Link to="/" className="back"><Icon name="back" size={25} />Back</Link>
      <div className="sh">
        <div>
          <h1>Event map</h1>
          <p>Every listener in this app and what triggers it.</p>
        </div>
      </div>
      <div className="tw">
        <table>
          <thead><tr><th>Event</th><th>Trigger</th><th>Handler</th><th>Result</th></tr></thead>
          <tbody>
            {EVENT_MAP.map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn"
        onClick={() => {
          // EVENT: onClick - RESET SAMPLE DATA after confirmation
          if (window.confirm('Replace all data with the sample data?')) {
            dispatch({ type: 'replace', db: { subjects: SEED() } });
            navigate('/');
          }
        }}
      >
        RESET SAMPLE DATA
      </button>
    </div>
  );
}
