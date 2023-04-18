export const modelFields: any = {
  user: {
    email: { type: "text", required: true },
    name: { type: "text", required: true },
    imageUrl: { type: "text" },
    userType: {
      type: "select",
      required: true,
      options: [
        ["FREE", "FREE"],
        ["PAID", "PAID"],
      ],
    },
    adminType: {
      type: "select",
      required: true,
      options: [
        ["NONE", "NONE"],
        ["NORMAL", "NORMAL"],
        ["SUPER", "SUPER"],
      ],
    },
  },
  waitList: {
    userId: { type: "relations", required: true },
  },
  post: {
    title: { type: "text", required: true },
    content: { type: "textarea", required: true },
    userId: { type: "relations", required: true },
  },
  aiRecord: {
    prompt: { type: "text", required: true },
    answer: { type: "text" },
    userId: { type: "relations", required: true },
  },
  chat: {
    title: { type: "text", required: true },
    userId: { type: "relations", required: true },
  },
  message: {
    chatType: {
      type: "select",
      required: true,
      options: [
        ["USER", "USER"],
        ["AI", "AI"],
      ],
    },
    userId: { type: "relations", required: true },
    body: { type: "textarea", required: true },
    chatId: { type: "relations", required: true },
  },
};

export const IncludeFields: any = {
  user: {
    posts: "true",
    ai_records: "true",
    wait_lists: "true",
  },
};
