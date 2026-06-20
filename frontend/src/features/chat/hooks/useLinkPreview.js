import { useState, useEffect } from "react";
import { axiosInstance } from "../../../services/api";

const cache = new Map();

export function useLinkPreview(url) {
  const [state, setState] = useState(() =>
    cache.has(url)
      ? { data: cache.get(url), isLoading: false, failed: false }
      : { data: null, isLoading: true, failed: false }
  );

  useEffect(() => {
    if (!url) return undefined;

    if (cache.has(url)) {
      setState({ data: cache.get(url), isLoading: false, failed: false });
      return undefined;
    }

    let cancelled = false;
    setState({ data: null, isLoading: true, failed: false });

    axiosInstance
      .get(`/messages/link-preview?url=${encodeURIComponent(url)}`)
      .then((response) => {
        const data = response.data.data;
        cache.set(url, data);
        if (!cancelled) setState({ data, isLoading: false, failed: false });
      })
      .catch(() => {
        if (!cancelled) setState({ data: null, isLoading: false, failed: true });
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}
