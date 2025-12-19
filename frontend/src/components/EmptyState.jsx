import './EmptyState.css';

function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <img 
        src="https://www.redditstatic.com/shreddit/assets/snoomojis/Snoo_Expression_NoMouth.png" 
        alt="Snoo" 
        className="empty-state__image" 
      />
      <p className="empty-state__message">{message}</p>
    </div>
  );
}

export default EmptyState;