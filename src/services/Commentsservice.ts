import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com";

function authHeaders() {
  return { headers: { token: localStorage.getItem("token") } };
}

class CommentsService {
  async getPostComments(postId: string) {
    const { data } = await axios.get(`${BASE_URL}/posts/${postId}/comments`, authHeaders());
    return data;
  }

  async createComment(postId: string, content: string) {
    const { data } = await axios.post(
      `${BASE_URL}/posts/${postId}/comments`,
      { content },
      authHeaders()
    );
    return data;
  }

  async updateComment(postId: string, commentId: string, content: string) {
    const { data } = await axios.put(
      `${BASE_URL}/posts/${postId}/comments/${commentId}`,
      { content },
      authHeaders()
    );
    return data;
  }

  async deleteComment(postId: string, commentId: string) {
    const { data } = await axios.delete(
      `${BASE_URL}/posts/${postId}/comments/${commentId}`,
      authHeaders()
    );
    return data;
  }
}

const commentsService = new CommentsService();
export default commentsService;