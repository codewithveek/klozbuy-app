import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(
  value: number,
  format: "compact" | "comma" = "compact",
  digits: number = 1
): string {
  if (isNaN(value)) return "";

  if (format === "compact") {
    const units = ["", "k", "M", "B", "T"];
    let unitIndex = 0;
    let compactValue = value;

    while (compactValue >= 1000 && unitIndex < units.length - 1) {
      compactValue /= 1000;
      unitIndex++;
    }

    // Format and remove trailing ".0" if unnecessary
    const formatted = compactValue
      .toFixed(digits)
      .replace(/\.0+$/, "")
      .replace(/(\.\d*[1-9])0+$/, "$1");

    return `${formatted}${units[unitIndex]}`;
  }

  // Default: comma-separated format
  return value.toLocaleString();
}

export const formatJoinDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", { month: "long", year: "numeric" });
};
export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};
export function renderHashtags(content: string): string {
  return content.replace(/#(\w+)/g, (_, tag) => {
    const encoded = encodeURIComponent(tag.toLowerCase());
    return `<a href="#/${encoded}" class="text-blue-500 hover:underline">#${tag}</a>`;
    // return `<a href="/hashtags/${encoded}" class="text-blue-500 hover:underline">#${tag}</a>`;
  });
}
