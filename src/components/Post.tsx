import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import type { PostI } from "../interfaces/posts";
import type { Commenti } from "../interfaces/commenti";
import Comment from "./Comment";
import AddComment from "./Addcomment";
import { authContext } from "../contexts/AuthContext";
import postsService from "../services/postsService";

const DEFAULT_PHOTO =
  "https://pub-3cba56becf9f4965bbb0909e07dada12.r2.dev/linkedPosts/default-profile.png";

type Props = {
  post: PostI;
  onChanged?: () => void | Promise<void>;
  onDeleted?: (postId: string) => void;
  comments?: Commenti[];
  isDetails?: boolean;
};

export default function Post({ post, onChanged, onDeleted, comments, isDetails }: Props) {
  const { UserData } = useContext(authContext);
  const isOwner = !!UserData?._id && UserData._id === post.user?._id;

  const [liked, setLiked] = useState<boolean>(!!UserData?._id && !!post.likes?.includes(UserData._id));
  const [likes, setLikes] = useState<number>(post.likesCount || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(post.body || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleLike() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((n) => Math.max(0, n + (nextLiked ? 1 : -1)));
    try {
      await postsService.toggleLike(post._id);
    } catch {
      setLiked(!nextLiked);
      setLikes((n) => Math.max(0, n + (nextLiked ? -1 : 1)));
    }
  }

  async function handleSaveEdit() {
    if (!draft.trim()) return;
    try {
      setSaving(true);
      setError("");
      await postsService.updatePost(post._id, draft.trim());
      setIsEditing(false);
      await onChanged?.();
    } catch {
      setError("Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this post?")) return;
    try {
      await postsService.deletePost(post._id);
      onDeleted?.(post._id);
    } catch {
      setError("Couldn't delete the post. Please try again.");
    }
  }

  const iconStroke = "#838383";
  const detailsLink = `/posts/${post._id}`;

  return (
    <div className="bg-white w-full rounded-md shadow-md h-auto py-3 px-3 my-5">
      <div className="w-full h-16 flex items-center justify-between">
        <div className="flex">
          <img
            className="rounded-full w-10 h-10 mr-3 object-cover"
            src={post.user?.photo || DEFAULT_PHOTO}
            alt={post.user?.name}
          />
          <div>
            <h3 className="text-md font-semibold">{post.user?.name}</h3>
            <Link to={detailsLink} className="text-xs text-gray-500 hover:underline">
              {post.createdAt}
            </Link>
          </div>
        </div>

        {isOwner && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button aria-label="Post options" className="cursor-pointer w-16 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round">
                  <circle cx={12} cy={12} r={1} />
                  <circle cx={19} cy={12} r={1} />
                  <circle cx={5} cy={12} r={1} />
                </svg>
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Post actions">
              <DropdownItem key="edit" onPress={() => { setDraft(post.body || ""); setIsEditing(true); }}>
                Edit post
              </DropdownItem>
              <DropdownItem key="delete" color="danger" className="text-danger" onPress={handleDelete}>
                Delete post
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>

      {isEditing ? (
        <div className="mt-4">
          <textarea
            autoFocus
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={saving}
            className="w-full resize-none rounded-md border-2 border-blue-900 p-3 outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditing(false)} disabled={saving} className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
              Cancel
            </button>
            <button type="button" onClick={handleSaveEdit} disabled={saving || !draft.trim()} className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      ) : (
        post.body && <p className="mt-4">{post.body}</p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {post.image && (
        <img src={post.image} className="w-full object-cover mt-2" alt="post" />
      )}

      <div className="w-full h-8 flex items-center px-3 my-3">
        <div className="bg-blue-500 z-10 w-5 h-5 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.71l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
        </div>
        <div className="w-full flex justify-between">
          <p className="ml-3 text-gray-500">{likes}</p>
          <Link to={detailsLink} className="ml-3 text-gray-500 hover:underline">
            {post.commentsCount || 0} comment
          </Link>
        </div>
      </div>

      <div className="flex justify-around w-full px-5 my-3 border-t pt-4 border-divider">
        <button
          type="button"
          onClick={handleLike}
          aria-pressed={liked}
          className="flex flex-row justify-center items-center space-x-3 cursor-pointer w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill={liked ? "#2563eb" : "none"} stroke={liked ? "#2563eb" : iconStroke} strokeWidth={2} strokeLinecap="square" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.71l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          <span className={`font-semibold text-lg ${liked ? "text-blue-600" : "text-gray-600"}`}>Like</span>
        </button>

        <Link to={detailsLink} className="flex flex-row justify-center items-center space-x-3 cursor-pointer w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke={iconStroke} strokeWidth={2} strokeLinecap="square" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="font-semibold text-lg text-gray-600">Comment</span>
        </Link>

        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(`${window.location.origin}${detailsLink}`)}
          className="flex flex-row justify-center items-center space-x-3 cursor-pointer w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke={iconStroke} strokeWidth={2} strokeLinecap="square" strokeLinejoin="round">
            <circle cx={18} cy={5} r={3} />
            <circle cx={6} cy={12} r={3} />
            <circle cx={18} cy={19} r={3} />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span className="font-semibold text-lg text-gray-600">Share</span>
        </button>
      </div>

      {isDetails ? (
        <>
          <AddComment postId={post._id} onAdded={() => onChanged?.()} />
          {comments?.map((c) => (
            <Comment key={c._id} comment={c} postId={post._id} onChanged={onChanged} />
          ))}
          {comments?.length === 0 && (
            <p className="px-5 py-4 text-center text-sm text-gray-500">
              No comments yet. Be the first to comment.
            </p>
          )}
        </>
      ) : (
        post.topComment && (
          <Comment comment={post.topComment} postId={post._id} onChanged={onChanged} />
        )
      )}
    </div>
  );
}