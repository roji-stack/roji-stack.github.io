import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/**
 * Everything uploaded through the CMS lands in src/assets/media.
 * Entries refer to files as "/src/assets/media/<name>"; we look them up by
 * file name so a bare "<name>" or "media/<name>" also works.
 */
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/media/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,gif,GIF,avif,AVIF,tif,tiff}',
  { eager: true },
);
const fileModules = import.meta.glob<string>('/src/assets/media/*.{pdf,PDF,step,STEP,stl,STL,zip}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const byName = <T>(mods: Record<string, T>) =>
  new Map(Object.entries(mods).map(([k, v]) => [k.split('/').pop()!.toLowerCase(), v]));
const images = byName(imageModules);
const files = byName(fileModules);

const nameOf = (path: string) => decodeURIComponent(path.split(/[?#]/)[0].split('/').pop() ?? '').toLowerCase();

/** True for paths that point into the media folder (as opposed to http(s) or /public URLs). */
export const isMediaPath = (path: string) =>
  !/^([a-z]+:)?\/\//i.test(path) && !path.startsWith('data:') && (images.has(nameOf(path)) || files.has(nameOf(path)));

export function resolveImage(path: string): ImageMetadata {
  const mod = images.get(nameOf(path));
  if (!mod) {
    throw new Error(`Image "${path}" not found in src/assets/media. Upload it through the CMS or copy it there.`);
  }
  return mod.default;
}

export const resolveFile = (path: string): string | undefined => files.get(nameOf(path));

export interface OptimizedImage {
  src: string;
  srcset?: string;
  width: number;
  height: number;
}

/** Resize + compress for the page column. Animated GIFs are passed through untouched. */
export async function optimize(path: string, maxWidth = 1400): Promise<OptimizedImage> {
  const meta = resolveImage(path);
  if (meta.format === 'gif') return { src: meta.src, width: meta.width, height: meta.height };
  const largest = Math.min(meta.width, maxWidth);
  const widths = [...new Set([Math.min(meta.width, 700), largest])];
  const img = await getImage({ src: meta, width: largest, widths, format: 'webp', quality: 80 });
  return {
    src: img.src,
    srcset: img.srcSet.attribute || undefined,
    width: largest,
    height: Math.round((meta.height / meta.width) * largest),
  };
}

/** 1200px JPEG for Open Graph previews (most social sites don't take WebP reliably). */
export async function ogImage(path: string): Promise<string> {
  const meta = resolveImage(path);
  const img = await getImage({ src: meta, width: Math.min(meta.width, 1200), format: 'jpg', quality: 80 });
  return img.src;
}
