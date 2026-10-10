export { defaultConfig } from './defaults';
export { resolveExpressiveCodeOptions } from './expressive-code';
export { resolveLlmsConfig } from './llms';
export { resolveMarkdownConfig } from './markdown';
export { defineDahliaConfig } from './options';
export {
  loadDahliaConfigFile,
  DAHLIA_CONFIG_FILE,
  mergeDahliaConfigOptions,
  normalizeLegacyDahliaConfigOptions,
  normalizeDocsBasePath,
  resolveAsyncDahliaConfig,
  resolveLocalAssetConfig,
  resolveDahliaConfig,
} from './resolve';
export { dahliaConfigPlugin } from './virtual';
export type { LlmsConfig, LlmsOption, ResolvedLlmsConfig } from './llms';
export type { DahliaIntegrationOptions, DahliaMarkdownOptions } from './options';
