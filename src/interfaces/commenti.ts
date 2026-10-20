import type { UserI } from "./usert";

export interface Commenti {
  _id: string;
  content: string;
  commentCreator: UserI;
  post: string;
  parentComment: null;
  likes: unknown[];
  createdAt: string;
}