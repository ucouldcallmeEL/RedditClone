import React from 'react';
import { Plus, Check, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // added

export function CreatePostButton({ onClick }: { onClick?: () => void }) {
  return (
    <button className="chip chip--ghost create-post" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }} onClick={onClick}>
      <Plus size={14} /> Create Post
    </button>
  );
}


export function ModToolsButton({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();
  return (
    <button
      className="chip chip--ghost"
      onClick={() => {
        if (onClick) onClick();
        navigate('/'); // redirect to home page
      }}
      style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}
    >
      <Check size={14} /> Mod tools
    </button>
  );
}

export function JoinLeaveButton({ joined, onClick }: { joined: boolean; onClick?: () => void }) {
  return (
    <button
      className={`chip`}
      onClick={onClick}
      aria-pressed={joined}
      style={
        joined
          ? { background: '#ef4444', color: '#fff', border: '1px solid #ef4444' }
          : undefined
      }
    >
      {joined ? <><UserPlus size={14} /> Leave</> : <><UserPlus size={14} /> Join</>}
    </button>
  );
}

export default {
  CreatePostButton,
  ModToolsButton,
  JoinLeaveButton,
};
