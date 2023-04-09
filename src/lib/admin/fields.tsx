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
};
