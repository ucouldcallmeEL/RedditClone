import { Image, Link2, Smile, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PostComposer() {
  return (
    <section className="composer card">
      <div className="composer__input">
        <Sparkles size={18} />
        <input 
          placeholder="Create post" 
          aria-label="Create post" 
        />
      </div>
      <div className="composer__actions">
        <button className="icon-pill">
          <Image size={16} />
          Media
        </button>
        <button className="icon-pill">
          <Link2 size={16} />
          Link
        </button>
        <button className="icon-pill">
          <Smile size={16} />
          Mood
        </button>
      </div>
    </section>
  );
}

export default PostComposer;

