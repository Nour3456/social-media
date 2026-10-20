import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com";

function authHeaders() {
  return { headers: { token: localStorage.getItem("token") } };
}

class PostsService {
  async getAllposts() {
    const { data } = await axios.get(`${BASE_URL}/posts`, authHeaders());
    return data;
  }

  async getPost(postId: string) {
    const { data } = await axios.get(`${BASE_URL}/posts/${postId}`, authHeaders());
    return data;
  }

  async createPost(formData: FormData) {
    const { data } = await axios.post(`${BASE_URL}/posts`, formData, authHeaders());
    return data;
  }

  async updatePost(postId: string, body: string) {
    const formData = new FormData();
    formData.append("body", body);
    const { data } = await axios.put(`${BASE_URL}/posts/${postId}`, formData, authHeaders());
    return data;
  }

  async deletePost(postId: string) {
    const { data } = await axios.delete(`${BASE_URL}/posts/${postId}`, authHeaders());
    return data;
  }

  async toggleLike(postId: string) {
    const { data } = await axios.put(`${BASE_URL}/posts/${postId}/like`, {}, authHeaders());
    return data;
  }
}

const postsService = new PostsService();
export default postsService;