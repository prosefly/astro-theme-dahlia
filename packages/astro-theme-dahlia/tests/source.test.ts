import { describe, expect, it } from 'vitest';
import { resolveDahliaConfig } from '../src/lib/config';
import { resolveEditUrl } from '../src/lib/page/edit-link';
import { getEntrySourcePath, normalizeHostedRepo } from '../src/lib/source';

describe('source and edit links', () => {
  it('normalizes hosted repository shorthands, ssh URLs, and edit URLs', () => {
    expect(normalizeHostedRepo('prosefly/astro-theme-dahlia', 'https://github.com')).toEqual({
      origin: 'https://github.com',
      path: 'prosefly/astro-theme-dahlia',
    });
    expect(normalizeHostedRepo('git@gitlab.com:group/project.git', 'https://gitlab.com')).toEqual({
      origin: 'https://gitlab.com',
      path: 'group/project',
    });
    expect(normalizeHostedRepo(
      'https://codeberg.org/prosefly/theme/_edit/main/src/content/docs/index.mdx',
      'https://codeberg.org',
    )).toEqual({
      origin: 'https://codeberg.org',
      path: 'prosefly/theme',
    });
  });

  it('uses entry.filePath for edit links instead of guessing from entry id', () => {
    const config = resolveDahliaConfig({
      source: {
        github: 'prosefly/astro-theme-dahlia',
        branch: 'main',
      },
      editLink: true,
    });
    const entry = {
      id: 'en/installation',
      filePath: `${process.cwd()}/src/content/docs/en/installation.mdx`,
      data: {},
    };

    expect(getEntrySourcePath(config, entry as never)).toBe('src/content/docs/en/installation.mdx');
    expect(resolveEditUrl(config, entry as never)).toBe(
      'https://github.com/prosefly/astro-theme-dahlia/edit/main/src/content/docs/en/installation.mdx',
    );
  });

  it('supports pattern edit links with encoded path placeholders', () => {
    const config = resolveDahliaConfig({
      editLink: {
        pattern: 'https://example.com/edit/{branch}/{encodedPath}',
        branch: 'release/next',
      },
    });
    const entry = {
      id: 'guide/my page',
      data: {},
    };

    expect(resolveEditUrl(config, entry as never)).toBe(
      'https://example.com/edit/release%2Fnext/guide%2Fmy%20page.mdx',
    );
  });
});
