import React from 'react';

type Props = {
  children: React.ReactNode;
  title?: string;
};

function SidebarCard({ children, title }: Props) {
  return (
    <section className="card sidebar-card">
      {title ? (
        <div className="section-heading">
          <h3>{title}</h3>
        </div>
      ) : null}

      <div>{children}</div>
    </section>
  );
}

export default SidebarCard;
