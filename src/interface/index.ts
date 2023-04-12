export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: User;
}

export interface User {
  ai_records?: AiRecord[];
  userType?: "FREE" | "PAID";
  id: string;
  email: string;
  name?: string;
  posts?: Post[];
  imageUrl?: string;
  adminType?: "NONE" | "NORMAL" | "SUPER";
}

export enum PromptType {
  CREATE_POST = "CREATE_POST",
  CONTINUE_POST = "CONTINUE_POST",
  ENHANCE_POST = "ENHANCE_POST",
  SUMMARIZE_POST = "SUMMARIZE_POST",
  NONE = "NONE",
}

export const PromptPrefix = {
  [PromptType.CREATE_POST]: "Write a blog post about ",
  [PromptType.CONTINUE_POST]: "Continue writing blog post after the paragraph: ",
  [PromptType.ENHANCE_POST]: "Enhance the paragrph: ",
  [PromptType.SUMMARIZE_POST]: "Summarize the paragrph: ",
  [PromptType.NONE]: "",
};

export interface AiRecord {
  id: string;
  prompt: string;
  answer?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}
