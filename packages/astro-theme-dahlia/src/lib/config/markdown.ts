import {
  isUnifiedProcessor,
  unified,
  type RehypePlugins,
  type RemarkPlugins,
} from '@astrojs/markdown-remark';
import type { AstroConfig } from 'astro';
import remarkCjkFriendly from 'remark-cjk-friendly/parseOnly';
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough/parseOnly';
import { rehypeHeadingAnchors } from '../markdown/heading-anchors';
import { remarkHeadingIds } from '../markdown/heading-ids';
import { resolveExpressiveCodeOptions } from './expressive-code';
import type { DahliaIntegrationOptions } from './options';

function isCjkLocale(value: string | undefined): boolean {
  return /^(zh|ja|ko)(-|$)/i.test(value ?? '');
}

function isAstroDefaultProcessor(processor: AstroConfig['markdown']['processor']): boolean {
  return processor?.name === 'satteri';
}

function shouldUseCjkFriendly(options: DahliaIntegrationOptions): boolean {
  const cjkFriendly = options.markdown?.cjkFriendly ?? 'auto';

  if (cjkFriendly !== 'auto') {
    return cjkFriendly;
  }

  return Object.entries(options.locales ?? {}).some(([localeKey, locale]) =>
    isCjkLocale(localeKey) || isCjkLocale(locale.lang)
  );
}

export function resolveMarkdownConfig(
  options: DahliaIntegrationOptions,
  markdownConfig: AstroConfig['markdown'],
) {
  const markdownOptions = options.markdown ?? {};
  const expressiveCodeOptions = resolveExpressiveCodeOptions(markdownOptions.expressiveCode);
  const processor = markdownConfig.processor;

  if (processor && !isUnifiedProcessor(processor) && !isAstroDefaultProcessor(processor)) {
    return markdownConfig;
  }

  const unifiedOptions = processor && isUnifiedProcessor(processor)
    ? processor.options
    : undefined;
  const existingRemarkPlugins = unifiedOptions?.remarkPlugins ?? markdownConfig.remarkPlugins ?? [];
  const existingRehypePlugins = unifiedOptions?.rehypePlugins ?? markdownConfig.rehypePlugins ?? [];
  const { remarkPlugins, rehypePlugins } = resolveDahliaMarkdownPlugins(options, markdownConfig);

  return {
    ...markdownConfig,
    processor: unified({
      remarkPlugins: [...remarkPlugins, ...existingRemarkPlugins],
      rehypePlugins: [...existingRehypePlugins, ...rehypePlugins],
      remarkRehype: unifiedOptions?.remarkRehype ?? markdownConfig.remarkRehype,
      gfm: unifiedOptions?.gfm ?? markdownConfig.gfm,
      smartypants: unifiedOptions?.smartypants ?? markdownConfig.smartypants,
    }),
    ...(expressiveCodeOptions === false
      ? {
          shikiConfig: {
            themes: {
              light: 'github-light',
              dark: 'github-dark',
            },
          },
        }
      : {}),
  };
}

function resolveDahliaMarkdownPlugins(
  options: DahliaIntegrationOptions,
  markdownConfig: AstroConfig['markdown'],
): { remarkPlugins: RemarkPlugins; rehypePlugins: RehypePlugins } {
  const markdownProcessor = markdownConfig?.processor;
  const unifiedOptions = markdownProcessor && isUnifiedProcessor(markdownProcessor)
    ? markdownProcessor.options
    : undefined;
  const gfm = unifiedOptions?.gfm ?? markdownConfig?.gfm;
  const cjkFriendlyPlugins = shouldUseCjkFriendly(options)
    ? [remarkCjkFriendly, ...(gfm === false ? [] : [remarkCjkFriendlyGfmStrikethrough])]
    : [];

  return {
    remarkPlugins: [remarkHeadingIds, ...cjkFriendlyPlugins],
    rehypePlugins: [rehypeHeadingAnchors],
  };
}
