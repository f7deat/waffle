"use client";

import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';
import { WebsiteBlock, WebsiteDocument } from '@/services/website-page';

const get = (block: WebsiteBlock, key: string) => block.settings[key] || '';

function ActionLink({ href, label }: { href: string; label: string }) {
  if (!label) return null;
  const className = 'inline-flex items-center bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800';
  return href.startsWith('/') || href.startsWith('#')
    ? <Link href={href || '#'} className={className}>{label}</Link>
    : <a href={href || '#'} className={className}>{label}</a>;
}

function HeroBlock({ block }: { block: WebsiteBlock }) {
  const imageUrl = get(block, 'imageUrl');
  return <section className="relative overflow-hidden bg-slate-950 text-white">
    {imageUrl && <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />}
    <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      {get(block, 'eyebrow') && <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-emerald-300">{get(block, 'eyebrow')}</p>}
      <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">{get(block, 'title')}</h1>
      {get(block, 'description') && <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{get(block, 'description')}</p>}
      <div className="mt-8"><ActionLink href={get(block, 'buttonUrl')} label={get(block, 'buttonLabel')} /></div>
    </div>
  </section>;
}

function RichTextBlock({ block }: { block: WebsiteBlock }) {
  return <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
    <h2 className="text-3xl font-bold text-slate-900">{get(block, 'title')}</h2>
    <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">{get(block, 'body')}</p>
  </section>;
}

function FeatureGridBlock({ block }: { block: WebsiteBlock }) {
  const items = ['itemOne', 'itemTwo', 'itemThree'].map((key) => get(block, key)).filter(Boolean);
  return <section className="bg-slate-100 py-16 sm:py-20"><div className="mx-auto max-w-6xl px-5 sm:px-8">
    <h2 className="text-3xl font-bold text-slate-900">{get(block, 'title')}</h2>
    <div className="mt-8 grid gap-px bg-slate-300 md:grid-cols-3">{items.map((item) => <div key={item} className="bg-white p-7 text-lg font-bold text-slate-800">{item}</div>)}</div>
  </div></section>;
}

function ImageBlock({ block }: { block: WebsiteBlock }) {
  const imageUrl = get(block, 'imageUrl');
  if (!imageUrl) return null;
  return <figure className="mx-auto max-w-6xl px-5 py-10 sm:px-8"><img src={imageUrl} alt={get(block, 'alt')} className="w-full object-cover" />{get(block, 'caption') && <figcaption className="mt-3 text-sm text-slate-500">{get(block, 'caption')}</figcaption>}</figure>;
}

function HtmlBlock({ block }: { block: WebsiteBlock }) {
  const html = get(block, 'html');
  if (!html) return null;
  return <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8"><div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} /></section>;
}

function CtaBlock({ block }: { block: WebsiteBlock }) {
  return <section className="bg-emerald-800 py-16 text-white sm:py-20"><div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
    <h2 className="text-3xl font-bold">{get(block, 'title')}</h2>
    <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-emerald-50">{get(block, 'description')}</p>
    <div className="mt-8"><ActionLink href={get(block, 'buttonUrl')} label={get(block, 'buttonLabel')} /></div>
  </div></section>;
}

function renderBlock(block: WebsiteBlock): React.ReactNode {
  if (block.hidden) return null;
  if (block.type === 'row') {
    return <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 md:grid-cols-2">{block.children?.map((child) => <div key={child.id}>{renderBlock(child)}</div>)}</section>;
  }
  if (block.type === 'col') {
    return <div className="flex flex-col gap-6">{block.children?.map((child) => <div key={child.id}>{renderBlock(child)}</div>)}</div>;
  }
  return renderers[block.type](block);
}

const renderers: Record<Exclude<WebsiteBlock['type'], 'row' | 'col'>, (block: WebsiteBlock) => React.ReactNode> = {
  hero: (block) => <HeroBlock block={block} />,
  richText: (block) => <RichTextBlock block={block} />,
  featureGrid: (block) => <FeatureGridBlock block={block} />,
  image: (block) => <ImageBlock block={block} />,
  html: (block) => <HtmlBlock block={block} />,
  cta: (block) => <CtaBlock block={block} />,
};

export default function WebsitePageRenderer({ document }: { document: WebsiteDocument }) {
  return <main>{document.blocks.map((block) => <div key={block.id}>{renderBlock(block)}</div>)}</main>;
}