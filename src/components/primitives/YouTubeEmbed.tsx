import type { Video } from "../../schema/common";

function getYouTubeVideoId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.split("/").filter(Boolean)[0] ?? "";
    }

    if (parsed.pathname.startsWith("/shorts/")) {
      return parsed.pathname.split("/").filter(Boolean)[1] ?? "";
    }

    if (parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.split("/").filter(Boolean)[1] ?? "";
    }

    return parsed.searchParams.get("v") ?? "";
  } catch {
    return "";
  }
}

export function YouTubeEmbed({ video }: { video: Video }) {
  const videoId = getYouTubeVideoId(video.url);

  if (!videoId) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--soft)] p-5 text-sm text-[var(--muted)]">
        無法解析 YouTube 影片：{video.url}
      </div>
    );
  }

  return (
    <figure>
      <div className="aspect-video overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-black shadow-[var(--shadow-soft)]">
        <iframe
          className="h-full w-full"
          title={video.title}
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {video.caption ? <figcaption className="mt-2 text-sm text-[var(--muted)]">{video.caption}</figcaption> : null}
    </figure>
  );
}
