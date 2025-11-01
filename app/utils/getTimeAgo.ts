export function getTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diffInSeconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours}h${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days}d${days > 1 ? "s" : ""} ago`;

  // fallback to date format for older posts
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}