import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { dahliaStylesPlugin } from '../src/lib/styles';

describe('Dahlia styles', () => {
  it('generates Tailwind Typography and Dahlia prose overrides', async () => {
    const root = mkdtempSync(join(tmpdir(), 'dahlia-styles-'));

    try {
      const plugin = dahliaStylesPlugin(
        pathToFileURL(`${root}/`),
        pathToFileURL(`${root}/src/`),
      );
      const buildStart = typeof plugin.buildStart === 'function'
        ? plugin.buildStart
        : plugin.buildStart?.handler;
      if (!buildStart) {
        throw new Error('Expected the Dahlia styles plugin to define buildStart');
      }

      const watchedFiles: string[] = [];
      const pluginContext = {
        addWatchFile(file: string) {
          watchedFiles.push(file);
        },
      } as unknown as ThisParameterType<typeof buildStart>;
      const inputOptions = {} as Parameters<typeof buildStart>[0];

      await buildStart.call(pluginContext, inputOptions);

      const generatedCss = readFileSync(join(root, '.astro/dahlia/styles.css'), 'utf8');

      expect(generatedCss).toMatch(/@plugin ".*typography\/src\/index\.js";/);
      expect(generatedCss).toContain('.prose :where(blockquote)');
      expect(generatedCss).toContain('quotes: none;');
      expect(watchedFiles.length).toBeGreaterThan(0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
