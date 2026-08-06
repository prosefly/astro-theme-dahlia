import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const virtualStylesModuleId = 'virtual:prosefly/dahlia/styles.css';
const styleFileUrls = [
  new URL('../styles/colors.css', import.meta.url),
  new URL('../styles/tokens.css', import.meta.url),
  new URL('../styles/prose/base.css', import.meta.url),
  new URL('../styles/prose/inline.css', import.meta.url),
  new URL('../styles/prose/lists.css', import.meta.url),
  new URL('../styles/prose/footnotes.css', import.meta.url),
  new URL('../styles/prose/blocks.css', import.meta.url),
  new URL('../styles/prose/code.css', import.meta.url),
  new URL('../styles/prose/expressive-code.css', import.meta.url),
  new URL('../styles/prose/media.css', import.meta.url),
  new URL('../styles/components.css', import.meta.url),
];
const dahliaSourceRoot = fileURLToPath(new URL('..', import.meta.url));

const baseCss = `
html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
`;

export function dahliaStylesPlugin(root: URL, srcDir: URL): Plugin {
  const rootPath = fileURLToPath(root);
  const generatedStylesDir = join(rootPath, '.astro', 'dahlia');
  const resolvedVirtualStylesModuleId = join(generatedStylesDir, 'styles.css');
  const projectSourceRoot = fileURLToPath(srcDir);
  const projectSourcePath = toCssSourcePath(relative(generatedStylesDir, projectSourceRoot));
  const dahliaSourcePath = toCssSourcePath(relative(generatedStylesDir, dahliaSourceRoot));

  return {
    name: '@prosefly/astro-theme-dahlia/styles',
    buildStart() {
      writeDahliaStylesFile(resolvedVirtualStylesModuleId, projectSourcePath, dahliaSourcePath);

      for (const url of styleFileUrls) {
        this.addWatchFile(fileURLToPath(url));
      }
    },
    resolveId(id) {
      if (id === virtualStylesModuleId) {
        writeDahliaStylesFile(resolvedVirtualStylesModuleId, projectSourcePath, dahliaSourcePath);
        return resolvedVirtualStylesModuleId;
      }
    },
  };
}

function writeDahliaStylesFile(
  file: string,
  projectSourcePath: string,
  dahliaSourcePath: string,
) {
  mkdirSync(dirname(file), { recursive: true });

  writeFileSync(
    file,
    [
      `@import "tailwindcss" source("${projectSourcePath}");`,
      `@source "${dahliaSourcePath}";`,
      ...styleFileUrls.map((url) => readFileSync(fileURLToPath(url), 'utf8')),
      baseCss,
    ].join('\n\n'),
  );
}

function toCssSourcePath(path: string): string {
  const cssPath = toCssPath(path);

  if (cssPath.startsWith('.')) {
    return cssPath;
  }

  if (cssPath.startsWith('/')) {
    return cssPath;
  }

  return `./${cssPath}`;
}

function toCssPath(path: string): string {
  return path.split(sep).join('/');
}
