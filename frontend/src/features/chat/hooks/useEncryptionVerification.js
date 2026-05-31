import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

const STORAGE_KEY = "verified-chats";

export function useEncryptionVerification(id) {
  const [isEncryptionVerified, setIsEncryptionVerified] = useState(false);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(STORAGE_KEY);
      const verifiedMap = saved ? JSON.parse(saved) : {};
      setIsEncryptionVerified(!!verifiedMap[id]);
    }
  }, [id]);

  const getVerificationFingerprint = useCallback((id1, id2) => {
    if (!id1 || !id2) return "00000 00000 00000 00000 00000 00000";
    const combined = [id1, id2].sort().join("");
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    const parts = [];
    for (let j = 0; j < 5; j++) {
      const seed = Math.abs(Math.sin(hash + j) * 100000);
      const code = Math.floor(seed % 100000)
        .toString()
        .padStart(5, "0");
      parts.push(code);
    }
    return parts.join(" ");
  }, []);

  const verifyEncryption = useCallback(
    (chatUserId) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      const verifiedMap = saved ? JSON.parse(saved) : {};
      verifiedMap[chatUserId] = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedMap));
      setIsEncryptionVerified(true);
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0.4, y: 0.6 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 0.6, y: 0.6 },
      });
    },
    [],
  );

  return { isEncryptionVerified, getVerificationFingerprint, verifyEncryption };
}
