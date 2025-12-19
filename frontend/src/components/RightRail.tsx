import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function RightRail() {
  return (
    <aside className="right-rail">
      <section className="card">
        <div className="section-heading">
          <h3>Trending today</h3>
          <button className="ghost-btn">
            View all <ArrowRight size={14} />
          </button>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted-text-color)' }}>
          Trending topics will appear here once we connect this section to the database.
        </p>
      </section>

      <section className="card">
        <div className="section-heading">
          <h3>Communities near you</h3>
          <button className="ghost-btn">Explore</button>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted-text-color)' }}>
          Suggested communities will show here once we fetch them from the backend.
        </p>
      </section>
    </aside>
  );
}

export default RightRail;

