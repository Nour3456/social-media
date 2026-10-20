import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

type CreatePostProps = {
  onPost?: (post: {
    content: string;
    photo: File | null;
  }) => Promise<void> | void;
};

export default function CreatePost({ onPost }: CreatePostProps) {
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearPhoto = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    clearPhoto();
    setContent("");
    setError("");
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePost = async () => {
    if (!content.trim() && !photo) return;
    try {
      setLoading(true);
      setError("");
      await onPost?.({ content: content.trim(), photo });
      resetForm();
      setShowForm(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canPost = content.trim().length > 0 || photo !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {showForm ? (
        <div>
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={2}
            disabled={loading}
            className="w-full resize-none rounded-md border-2 border-blue-900 p-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200"
          />

          {preview && (
            <div className="relative mt-3 inline-block">
              <img
                src={preview}
                alt="Selected"
                className="max-h-60 rounded-md object-cover"
              />
              <button
                type="button"
                onClick={clearPhoto}
                aria-label="Remove photo"
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white hover:bg-black/80 cursor-pointer"
              >
                ×
              </button>
            </div>
          )}

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <div className="mt-4 flex items-center justify-between">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              Photo
            </button>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePost}
                disabled={!canPost || loading}
                className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full cursor-pointer text-left text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg px-4 py-3"
        >
          What's on your mind? Share a post...
        </button>
      )}
    </div>
  );
}