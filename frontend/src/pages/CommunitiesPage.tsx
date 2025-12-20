import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/community.css';
import '../styles/communities.css';
import CommunitiesGrid from '../components/CommunitiesGrid';
import { API_BASE_URL } from '../services/config';

interface Community {
  _id: string;
  name: string;
  description: string;
  profilePicture: string;
  members: string[];
}

function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // hide sidebar while this page is open
  useEffect(() => {
    const cls = 'communities-open';
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove(cls);
  }, []);

  useEffect(() => {
    const apiRoot = API_BASE_URL.replace(/\/api$/, '');
    fetch(`${apiRoot}/r/communities`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Community[]) => {
        // Sort by number of members descending, take up to 250
        const sorted = data
          .sort((a, b) => (b.members?.length || 0) - (a.members?.length || 0))
          .slice(0, 250);
        setCommunities(sorted);
      })
      .catch((err) => {
        console.error('Failed to fetch communities', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="feed"><p>Loading communities...</p></main>;
  if (error) return <main className="feed"><p>Error: {error}</p></main>;

  return (
    <main className="feed communities-page">
      <div className="page-top-center">
        <h2>Best of Reddit</h2>
      </div>
      <div className="communities-header">
        <div>
          <h1>Top Communities</h1>
          <p className="muted">Browse the largest communities</p>
        </div>
      </div>

      <section>
        <CommunitiesGrid communities={communities} columns={4} />
      </section>
    </main>
  );
}

export default CommunitiesPage;