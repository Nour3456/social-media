import { useContext, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import type { Commenti } from "../interfaces/commenti";
import { authContext } from "../contexts/AuthContext";
import commentsService from "../services/Commentsservice";

const DEFAULT_PHOTO =
  "https://pub-3cba56becf9f4965bbb0909e07dada12.r2.dev/linkedPosts/default-profile.png";

type Props = {
  comment: Commenti;
  postId: string;
  onChanged?: () => void | Promise<void>;
};

export default function Comment({ comment, postId, onChanged }: Props) {
  const { UserData } = useContext(authContext);
  const isOwner =
    !!UserData?._id && UserData._id === comment.commentCreator?._id;

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function saveEdit() {
    if (!draft.trim() || draft.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      await commentsService.updateComment(postId, comment._id, draft.trim());
      setIsEditing(false);
      await onChanged?.();
    } catch {
      setError("Couldn't save your changes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await commentsService.deleteComment(postId, comment._id);
      await onChanged?.();
    } catch {
      setError("Couldn't delete the comment. Please try again.");
    }
  }

  return (
    <div className="w-full px-5 my-3 border-t pt-4 border-divider">
      <div className="flex items-center justify-between">
        <div className="flex">
          <img
            className="rounded-full w-10 h-10 mr-3 object-cover"
            src={comment.commentCreator.photo || DEFAULT_PHOTO}
            alt={comment.commentCreator.name}
          />
          <div>
            <h3 className="text-md font-semibold">{comment.commentCreator.name}</h3>
            <p className="text-xs text-gray-500">{comment.createdAt}</p>
          </div>
        </div>

        {isOwner && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button aria-label="Comment options" className="cursor-pointer text-gray-400 hover:text-gray-600">
                <svg width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx={12} cy={12} r={1} />
                  <circle cx={19} cy={12} r={1} />
                  <circle cx={5} cy={12} r={1} />
                </svg>
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Comment actions">
              <DropdownItem key="edit" onPress={() => { setDraft(comment.content); setIsEditing(true); }}>
                Edit
              </DropdownItem>
              <DropdownItem key="delete" color="danger" className="text-danger" onPress={handleDelete}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>

      <div className="ps-12 pt-4">
        {isEditing ? (
          <div>
            <textarea
              autoFocus
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={loading}
              className="w-full resize-none rounded-md border-2 border-blue-900 p-2 outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div className="mt-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setIsEditing(false)} disabled={loading} className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={saveEdit} disabled={loading || !draft.trim()} className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        ) : (
          <p>{comment.content}</p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}