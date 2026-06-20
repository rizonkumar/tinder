const URL_PATTERN = /(https?:\/\/[^\s]+)/gi;

export function extractFirstUrl(text) {
  if (!text) return null;
  const match = text.match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : null;
}

export function linkify(text, linkClassName = "") {
  if (!text) return text;

  const parts = text.split(URL_PATTERN);

  return parts.map((part, index) => {
    if (!part) return null;
    if (/^https?:\/\//i.test(part)) {
      return (
        <a
          key={`${index}-${part}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className={linkClassName}
        >
          {part}
        </a>
      );
    }
    return <span key={`${index}-text`}>{part}</span>;
  });
}
