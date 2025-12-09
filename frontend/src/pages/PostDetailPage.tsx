import { useParams, useNavigate } from 'react-router-dom';
import PostDetail from '../components/PostDetail';

function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const handleBackToFeed = () => {
    navigate('/');
  };

  if (!postId) {
    return (
      <div className="error card">
        Invalid post ID
      </div>
    );
  }

  return <PostDetail postId={postId} onBack={handleBackToFeed} />;
}

export default PostDetailPage;

