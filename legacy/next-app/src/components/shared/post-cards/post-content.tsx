import { tokenizeContent } from "@/lib/helpers/tokenize-content";
import Link from "next/link";
import { useMemo } from "react";

export function PostContent({ content }: { content: string }) {
  const tokens = useMemo(() => {
    return tokenizeContent(content);
  }, [content]);

  return (
    <p>
      {tokens.map((token, index) => {
        if (token.type === "hashtag") {
          return (
            <Link key={index} href={`/hashtags/${token.value.toLowerCase()}`}>
              <span className="text-blue-500 hover:underline">
                #{token.value}
              </span>
            </Link>
          );
        } else if (token.type === "mention") {
          return (
            <Link key={index} href={`/user/${token.value}`}>
              <span className="text-purple-500 hover:underline">
                @{token.value}
              </span>
            </Link>
          );
        } else {
          return <span key={index}>{token.text}</span>;
        }
      })}
    </p>
  );
}
