type Token =
  | { type: "text"; text: string }
  | { type: "hashtag"; value: string }
  | { type: "mention"; value: string };

export function tokenizeContent(content: string): Token[] {
  const regex = /(@\w+|#\w+)/g;
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "text",
        text: content.slice(lastIndex, match.index),
      });
    }

    const word = match[0];
    if (word.startsWith("@")) {
      tokens.push({ type: "mention", value: word.slice(1) });
    } else if (word.startsWith("#")) {
      tokens.push({ type: "hashtag", value: word.slice(1) });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    tokens.push({ type: "text", text: content.slice(lastIndex) });
  }

  return tokens;
}
