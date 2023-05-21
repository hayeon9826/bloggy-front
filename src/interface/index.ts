export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  summary: string;
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
  CREATE_TITLE = "CREATE_TITLE",
  CHAT = "CHAT",
  NONE = "NONE",
}

export const PromptPrefix = {
  [PromptType.CREATE_POST]: "Write a blog post about the topic below. \n",
  [PromptType.CONTINUE_POST]: "Continue writing blog post after the paragraph below. \n",
  [PromptType.ENHANCE_POST]: "Enhance the paragrph below  \n",
  [PromptType.SUMMARIZE_POST]: "Summarize the paragrph: ",
  [PromptType.CREATE_TITLE]: "(exclude words: title) make me a title of a chat starting with ",
  [PromptType.CHAT]: "The following is a conversation from human to AI assistant. The assistant is helpful, creative, clever, and very friendly. \nHuman: ",
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
