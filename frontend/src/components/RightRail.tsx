import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Community, TrendingTopic } from '../types';

type Props = {
  trendingTopics: TrendingTopic[];
  communities: Community[];
};

function RightRail({ trendingTopics, communities }: Props) {
  return (
    <aside className="right-rail">
      <section className="card">
        <div className="section-heading">
          <h3>Trending today</h3>
          <button className="ghost-btn">
            View all <ArrowRight size={14} />
          </button>
        </div>
        <ul className="trending-list">
          {trendingTopics.map((topic) => (
            <li key={topic.label}>
              <p>{topic.label}</p>
              <span>{topic.postsToday.toLocaleString()} posts today</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <div className="section-heading">
          <h3>Communities near you</h3>
          <button className="ghost-btn">Explore</button>
        </div>
        <ul className="community-list">
          {communities.map((community) => {
            const slug = community.name.replace(/^r\//i, '');
            return (
              <li key={community.name}>
                <Link to={`/community/${slug}`} style={{ display: 'contents', textDecoration: 'none', color: 'inherit' }}>
                  <img src={community.avatar} alt={community.name} loading="lazy" />

                  <div>
                    <p>{community.name}</p>
                    <span>{community.members}</span>
                    <small>{community.description}</small>
                  </div>
                </Link>

                <button className="chip">Join</button>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}

export default RightRail;

