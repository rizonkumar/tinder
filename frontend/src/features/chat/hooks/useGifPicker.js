import { useState, useEffect, useCallback } from "react";
import { fallbackGifs } from "../../../constants";
import { useMessageStore } from "../../../store/useMessageStore";
import showToast from "../../../components/common/Toast";
import { compressImage, estimateDataUrlBytes } from "../utils/compressImage";

const GIPHY_API_KEY = "dc6zaTOxFJmzC";
const GIPHY_LIMIT = 12;
const DEBOUNCE_MS = 500;
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

export function useGifPicker() {
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifQuery, setGifQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);

  const sendMessage = useMessageStore((state) => state.sendMessage);

  useEffect(() => {
    if (!showGifPicker) return;

    const fetchGifs = async () => {
      setIsLoadingGifs(true);
      try {
        const query = gifQuery.trim() || "love";
        const res = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=${GIPHY_LIMIT}`,
        );
        const data = await res.json();
        if (data?.data?.length > 0) {
          setGifs(
            data.data.map((item) => ({
              id: item.id,
              title: item.title,
              url: item.images.fixed_height.url,
            })),
          );
        } else {
          setGifs(fallbackGifs);
        }
      } catch {
        setGifs(fallbackGifs);
      } finally {
        setIsLoadingGifs(false);
      }
    };

    const delayDebounce = setTimeout(fetchGifs, DEBOUNCE_MS);
    return () => clearTimeout(delayDebounce);
  }, [gifQuery, showGifPicker]);

  const handleImageUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast.error("Please select an image file");
        return;
      }

      try {
        const dataUrl = await compressImage(file);
        if (estimateDataUrlBytes(dataUrl) > MAX_UPLOAD_BYTES) {
          showToast.error("This image is too large to send. Max size is 2MB.");
          return;
        }
        await sendMessage("", "image", dataUrl);
      } catch (error) {
        showToast.error(error.message || "Could not process the selected image");
      }
    },
    [sendMessage],
  );

  return {
    showGifPicker,
    setShowGifPicker,
    gifQuery,
    setGifQuery,
    gifs,
    isLoadingGifs,
    handleImageUpload,
  };
}
