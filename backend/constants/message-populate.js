export const MESSAGE_POPULATE = [
  { path: "sender", select: "name image" },
  { path: "receiver", select: "name image" },
  {
    path: "replyTo",
    populate: { path: "sender", select: "name" },
  },
];
