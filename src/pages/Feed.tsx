import { useEffect, useState } from "react";
import postsService from "../services/postsService";
import type { PostI } from "../interfaces/posts";
import Post from "../components/Post";
import CreatePost from "../components/CreatePost";

export default function Feed() {
  const [posts, setPosts] = useState<PostI[]>([]);

  useEffect(() => {
    getAllPosts();
  }, []);

  async function getAllPosts() {
    const { data } = await postsService.getAllposts();
    setPosts(data.posts);
  }

  async function handleCreatePost({
    content,
    photo,
  }: {
    content: string;
    photo: File | null;
  }) {
    const formData = new FormData();
    formData.append("body", content);
    if (photo) formData.append("image", photo);

    await postsService.createPost(formData);
    await getAllPosts();
  }

  return (
    <div className="container max-w-3xl my-10 mx-auto">
      <div className="grid gap-4">
        <CreatePost onPost={handleCreatePost} />

        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            onChanged={getAllPosts}
            onDeleted={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
          />
        ))}
      </div>
    </div>
  );
}