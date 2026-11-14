/**
 * Markdown → HTML for project write-ups (the section fields and the body).
 *
 * Supports: GFM tables, footnotes, task lists · $inline$ and $$display$$ math (KaTeX)
 * · fenced code (Shiki, no client JS) · media from src/assets/media (resized at build).
 *
 * Conventions that the CMS editor produces naturally:
 *   ![alt text](/src/assets/media/photo.jpg "Caption")   → <figure> with <figcaption>
 *   [Design report](/src/assets/media/report.pdf)        → embedded PDF viewer + download link
 *     (when the link is alone in its own paragraph; inline PDF links stay links)
 *   A paragraph starting with "TODO" gets a visible dashed box so gaps are obvious.
 */
import { unified, type Processor } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';
import { visit, SKIP } from 'unist-util-visit';
import { h } from 'hastscript';
import type { Root, Element, ElementContent, Parent } from 'hast';
import { isMediaPath, isVideo, optimize, resolveFile, videoPoster } from './media';

const isWs = (n: ElementContent) => n.type === 'text' && !n.value.trim();
const onlyChild = (el: Element) => {
  const kids = el.children.filter((c) => !isWs(c));
  return kids.length === 1 && kids[0].type === 'element' ? kids[0] : undefined;
};
const textOf = (n: ElementContent): string =>
  n.type === 'text' ? n.value : n.type === 'element' ? n.children.map(textOf).join('') : '';

/** Turn an <img> pointing at a video file into a native <video> player (no JS). */
function toVideo(img: Element, jobs: Promise<void>[]) {
  const src = String(img.properties.src ?? '');
  const alt = String(img.properties.alt ?? '');
  const url = isMediaPath(src) ? (resolveFile(src) ?? src) : src;
  const video = h('video', { controls: true, muted: true, loop: true, playsInline: true, preload: 'metadata', 'aria-label': alt || undefined }, [
    h('source', { src: url, type: /\.webm/i.test(src) ? 'video/webm' : 'video/mp4' }),
    h('p', ['Your browser can’t play this video. ', h('a', { href: url }, 'Download it'), '.']),
  ]);
  if (isMediaPath(src)) {
    jobs.push(
      videoPoster(src).then((poster) => {
        if (!poster) return;
        Object.assign(video.properties, { poster: poster.src, width: poster.width, height: poster.height, preload: 'none' });
      }),
    );
  }
  return video;
}

function rehypeMedia() {
  return async (tree: Root) => {
    const jobs: Promise<void>[] = [];

    // 1. Lone images / lone PDF links in a paragraph become figures.
    visit(tree, 'element', (node, index, parent: Parent | undefined) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const child = onlyChild(node);
      if (!child) return;

      if (child.tagName === 'img') {
        const title = child.properties.title as string | undefined;
        delete child.properties.title;
        const media = isVideo(String(child.properties.src ?? '')) ? toVideo(child, jobs) : child;
        parent.children[index] = h(isVideo(String(child.properties.src ?? '')) ? 'figure.video' : 'figure', [
          media,
          ...(title ? [h('figcaption', title)] : []),
        ]);
        return SKIP;
      }

      const href = child.tagName === 'a' ? String(child.properties.href ?? '') : '';
      if (/\.pdf([?#].*)?$/i.test(href)) {
        const url = isMediaPath(href) ? (resolveFile(href) ?? href) : href;
        const label = textOf(child).trim() || 'PDF';
        // A lazy iframe only downloads the PDF when it scrolls near the viewport.
        // The caption link is the fallback for browsers that can't show PDFs inline (most phones).
        parent.children[index] = h('figure.pdf', [
          h('iframe', { src: url, title: label, loading: 'lazy' }),
          h('figcaption', [label, ' · ', h('a', { href: url }, 'open the PDF in a new tab'), ' (recommended on phones)']),
        ]);
        return SKIP;
      }
    });

    // 2. Resolve media paths: optimize images, fingerprint other files.
    visit(tree, 'element', (node, index, parent: Parent | undefined) => {
      if (node.tagName === 'img' && isVideo(String(node.properties.src ?? '')) && parent && index !== undefined) {
        parent.children[index] = toVideo(node, jobs); // video used inline, not on its own line
        return SKIP;
      }
      if (node.tagName === 'img') {
        const src = String(node.properties.src ?? '');
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
        if (!isMediaPath(src)) return;
        jobs.push(
          optimize(src).then((img) => {
            Object.assign(node.properties, {
              src: img.src,
              srcSet: img.srcset,
              sizes: img.srcset ? '(min-width: 760px) 700px, 100vw' : undefined,
              width: img.width,
              height: img.height,
            });
          }),
        );
      } else if (node.tagName === 'a') {
        const href = String(node.properties.href ?? '');
        if (isMediaPath(href)) node.properties.href = resolveFile(href) ?? href;
      }
    });

    // 3. Mark TODO paragraphs.
    visit(tree, 'element', (node) => {
      if (node.tagName === 'p' && /^\s*TODO\b/.test(textOf(node))) {
        node.properties.className = ['todo'];
      }
    });

    // 4. Wide tables scroll inside their own box instead of the page.
    visit(tree, 'element', (node, index, parent: Parent | undefined) => {
      if (node.tagName !== 'table' || !parent || index === undefined) return;
      parent.children[index] = h('div.table-wrap', { tabIndex: 0, role: 'region', 'aria-label': 'Table' }, [node]);
      return SKIP;
    });

    await Promise.all(jobs);
  };
}

/**
 * Shift headings down so a "## Heading" written inside a section field nests under
 * that section's own <h2>. Works on the syntax tree, so code blocks are untouched.
 */
function remarkDemote() {
  return (tree: any, file: any) => {
    const by = Number(file.data?.demoteHeadings ?? 0);
    if (!by) return;
    visit(tree, 'heading', (node: any) => {
      node.depth = Math.min(node.depth + by, 6);
    });
  };
}

let processor: Processor<any, any, any, any, string> | undefined;

function getProcessor() {
  processor ??= unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkDemote)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeMedia)
    .use(rehypeKatex, { output: 'htmlAndMathml', throwOnError: false })
    .use(rehypeShiki, {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'light',
      fallbackLanguage: 'text',
    })
    .use(rehypeStringify) as any;
  return processor!;
}

export async function renderMarkdown(md: string | undefined, { demoteHeadings = 0 } = {}) {
  if (!md?.trim()) return '';
  const file = await getProcessor().process({ value: md, data: { demoteHeadings } });
  return String(file);
}
