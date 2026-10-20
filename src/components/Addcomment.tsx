import { useState } from "react";
import commentsService from "../services/Commentsservice";

type Props = { postId: string; onAdded: () => void | Promise<void> };

export default function AddComment({ postId, onAdded }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!content.trim()) return;
    try {
      setLoading(true);
      setError("");
      await commentsService.createComment(postId, content.trim());
      setContent("");
      await onAdded();
    } catch {
      setError("Couldn't add your comment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-5 pt-2">
      <div className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={loading}
          placeholder="Write a comment..."
          className="flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={submit}
          disabled={loading || !content.trim()}
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Sending..." : "Comment"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}