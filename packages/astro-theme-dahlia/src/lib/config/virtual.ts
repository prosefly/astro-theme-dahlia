import type { Plugin } from 'vite';
import type { DahliaThemeConfig } from '../theme';

const virtualConfigModuleId = 'virtual:prosefly/dahlia/config';
const resolvedVirtualConfigModuleId = `\0${virtualConfigModuleId}`;

export function dahliaConfigPlugin(config: DahliaThemeConfig): Plugin {
  return {
    name: '@prosefly/astro-theme-dahlia/config',
    resolveId(id) {
      if (id === virtualConfigModuleId) {
        return resolvedVirtualConfigModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualConfigModuleId) {
        return `export default ${JSON.stringify(config)};`;
      }
    },
  };
}
