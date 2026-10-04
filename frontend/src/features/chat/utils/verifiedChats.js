const STORAGE_KEY = "verified-chats";

export function readVerifiedChats() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function isChatVerified(userId) {
  return !!readVerifiedChats()[userId];
}
