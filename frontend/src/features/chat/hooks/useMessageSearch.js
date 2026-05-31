import { useState, useCallback } from "react";
import { useMessageStore } from "../../../store/useMessageStore";

export function useMessageSearch(id) {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatches, setSearchMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [activeHighlightedMessageId, setActiveHighlightedMessageId] =
    useState(null);

  const scrollToAndHighlight = useCallback((messageId) => {
    setActiveHighlightedMessageId(messageId);
    setTimeout(() => {
      const el = document.getElementById(`msg-${messageId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);

    setTimeout(() => {
      setActiveHighlightedMessageId((prev) =>
        prev === messageId ? null : prev,
      );
    }, 2000);
  }, []);

  const handleSearch = useCallback(
    async (query) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setSearchMatches([]);
        setCurrentMatchIndex(-1);
        setActiveHighlightedMessageId(null);
        return;
      }

      const matchesList = await useMessageStore
        .getState()
        .searchMessages(id, query);

      setSearchMatches(matchesList);
      if (matchesList.length > 0) {
        setCurrentMatchIndex(0);
        scrollToAndHighlight(matchesList[0]._id);
      } else {
        setCurrentMatchIndex(-1);
        setActiveHighlightedMessageId(null);
      }
    },
    [id, scrollToAndHighlight],
  );

  const nextSearchMatch = useCallback(() => {
    if (searchMatches.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIdx);
    scrollToAndHighlight(searchMatches[nextIdx]._id);
  }, [searchMatches, currentMatchIndex, scrollToAndHighlight]);

  const prevSearchMatch = useCallback(() => {
    if (searchMatches.length === 0) return;
    const prevIdx =
      (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    setCurrentMatchIndex(prevIdx);
    scrollToAndHighlight(searchMatches[prevIdx]._id);
  }, [searchMatches, currentMatchIndex, scrollToAndHighlight]);

  const toggleSearchBar = useCallback(() => {
    setShowSearchBar((prev) => {
      if (prev) {
        setSearchQuery("");
        setSearchMatches([]);
        setCurrentMatchIndex(-1);
        setActiveHighlightedMessageId(null);
      }
      return !prev;
    });
  }, []);

  const resetSearch = useCallback(() => {
    setShowSearchBar(false);
    setSearchQuery("");
    setSearchMatches([]);
    setCurrentMatchIndex(-1);
    setActiveHighlightedMessageId(null);
  }, []);

  return {
    showSearchBar,
    searchQuery,
    searchMatches,
    currentMatchIndex,
    activeHighlightedMessageId,
    handleSearch,
    scrollToAndHighlight,
    nextSearchMatch,
    prevSearchMatch,
    toggleSearchBar,
    resetSearch,
  };
}
