import React from 'react';
import type { FC } from 'react';
import CommunityCard from './CommunityCard';

interface Community {
  _id: string;
  name: string;
  description: string;
  profilePicture: string;
  members: string[];
}

interface Props {
  communities: Community[];
  columns?: number;
}

const chunk = <T,>(arr: T[], size: number) => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const CommunitiesGrid: FC<Props> = ({ communities, columns = 4 }) => {
  const rows = chunk(communities, columns);

  return (
    <div className="communities-grid">
      {rows.map((row, rowIndex) => (
        <div className="communities-row" key={rowIndex}>
          {row.map((community, colIndex) => (
            <CommunityCard
              key={community._id}
              community={community}
              rank={rowIndex * columns + colIndex + 1}
            />
          ))}

          {/* Fill placeholders so the row always has `columns` cells */}
          {Array.from({ length: columns - row.length }).map((_, idx) => (
            <div className="community-card community-placeholder" key={`ph-${idx}`} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CommunitiesGrid;
