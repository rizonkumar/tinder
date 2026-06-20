const GROUP_GAP_MS = 5 * 60 * 1000;

function senderId(message) {
  return message.sender?._id || message.sender;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDateSeparator(date) {
  const now = new Date();
  const target = new Date(date);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(target, now)) return "Today";
  if (isSameDay(target, yesterday)) return "Yesterday";

  return target.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: target.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

export function decorateMessages(messages) {
  return messages.map((message, index) => {
    const prev = messages[index - 1];
    const next = messages[index + 1];
    const createdAt = new Date(message.createdAt);

    const showDateSeparator =
      !prev || !isSameDay(new Date(prev.createdAt), createdAt);

    const sameSenderAsPrev =
      prev &&
      senderId(prev) === senderId(message) &&
      isSameDay(new Date(prev.createdAt), createdAt) &&
      createdAt - new Date(prev.createdAt) < GROUP_GAP_MS;

    const sameSenderAsNext =
      next &&
      senderId(next) === senderId(message) &&
      isSameDay(new Date(next.createdAt), createdAt) &&
      new Date(next.createdAt) - createdAt < GROUP_GAP_MS;

    return {
      message,
      showDateSeparator,
      isFirstOfGroup: !sameSenderAsPrev || showDateSeparator,
      isLastOfGroup: !sameSenderAsNext,
    };
  });
}
