import { BookOpenText } from "lucide-react";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { YouTubeEmbed } from "../components/primitives/YouTubeEmbed";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import type { BlockProps } from "./types";

type GuideIntroBlockType = Extract<BlockProps["block"], { type: "guideIntro" }>;
type ArticleGuideData = NonNullable<GuideIntroBlockType["data"]["articleGuide"]>;
type ArticleNode =
  | { type: "heading"; level: 1 | 2; text: string }
  | { type: "paragraph"; text: string }
  | { type: "rule" };

function parseArticle(content: string): ArticleNode[] {
  const nodes: ArticleNode[] = [];
  const paragraph: string[] = [];

  function flushParagraph() {
    if (!paragraph.length) {
      return;
    }

    nodes.push({ type: "paragraph", text: paragraph.join("\n") });
    paragraph.length = 0;
  }

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    if (trimmed === "---") {
      flushParagraph();
      nodes.push({ type: "rule" });
      continue;
    }

    const heading = /^(#{1,2})\s+(.+)$/.exec(trimmed);

    if (heading) {
      flushParagraph();
      nodes.push({ type: "heading", level: heading[1].length as 1 | 2, text: heading[2] });
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return nodes;
}

function ArticleContent({ content }: { content: string }) {
  const nodes = parseArticle(content);

  return (
    <article className="mx-auto max-w-[760px] px-5 pb-12 pt-14 text-[var(--foreground)] md:px-8 md:pt-16">
      {nodes.map((node, index) => {
        if (node.type === "rule") {
          return <hr className="my-9 border-[var(--border)]" key={`rule-${index}`} />;
        }

        if (node.type === "heading") {
          const Heading = node.level === 1 ? "h1" : "h2";
          const className =
            node.level === 1
              ? "mb-6 text-3xl font-extrabold leading-tight tracking-normal md:text-4xl"
              : "mb-4 mt-10 text-2xl font-bold leading-tight tracking-normal md:text-3xl";

          return (
            <Heading className={className} key={`heading-${index}`}>
              {node.text}
            </Heading>
          );
        }

        return (
          <p className="my-4 whitespace-pre-line text-base leading-8 text-[var(--muted)] md:text-lg md:leading-9" key={`paragraph-${index}`}>
            {node.text}
          </p>
        );
      })}
    </article>
  );
}

function ArticleGuideButton({ article }: { article: ArticleGuideData }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="mt-5 w-full md:w-auto">
          <BookOpenText className="h-4 w-4" />
          {article.buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle className="sr-only">{article.articleTitle}</DialogTitle>
        <ArticleContent content={article.content} />
      </DialogContent>
    </Dialog>
  );
}

export function GuideIntroBlock({ block }: BlockProps<GuideIntroBlockType>) {
  return (
    <section>
      <div className="grid gap-7">
        <div className="max-w-[860px]">
          <SectionHeader kicker={block.data.kicker} title={block.data.title} />
          {block.data.body ? <p className="max-w-[780px] text-[var(--muted)]">{block.data.body}</p> : null}
          {block.data.articleGuide ? <ArticleGuideButton article={block.data.articleGuide} /> : null}
        </div>
        {block.data.video ? <YouTubeEmbed video={block.data.video} /> : null}
        {block.data.maps.length ? (
          <div aria-label={block.data.mapLabel} className="grid gap-5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--map-bg)] p-5 md:grid-cols-[1.1fr_.9fr]">
            {block.data.maps.map((map) => (
              <img className="w-full object-contain" src={map.src} alt={map.alt} key={map.src} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
