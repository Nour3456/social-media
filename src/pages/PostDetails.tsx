import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Post from "../components/Post";
import type { PostI } from "../interfaces/posts";
import type { Commenti } from "../interfaces/commenti";
import postsService from "../services/postsService";
import commentsService from "../services/Commentsservice";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostI | null>(null);
  const [comments, setComments] = useState<Commenti[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const [postRes, commentsRes] = await Promise.all([
        postsService.getPost(id),
        commentsService.getPostComments(id),
      ]);
      setPost(postRes.data.post);
      setComments(commentsRes.data.comments);
      setError("");
    } catch {
      setError("We couldn't load this post. It may have been deleted.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="container max-w-3xl my-10 mx-auto">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        Back to feed
      </Link>

      {loading && <p className="mt-6 text-center text-gray-500">Loading post...</p>}
      {error && <p className="mt-6 text-center text-red-600">{error}</p>}

      {post && (
        <Post
          post={post}
          isDetails
          comments={comments}
          onChanged={load}
          onDeleted={() => navigate("/")}
        />
      )}
    </div>
  );
}