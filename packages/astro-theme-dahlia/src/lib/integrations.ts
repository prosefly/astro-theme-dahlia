import proseflyComponents, {
  COMPONENTS_INTEGRATION_NAME,
} from '@prosefly/astro-components/integration';
import type { AstroIntegration } from 'astro';

export function createDefaultComponentsIntegration(
  integrations: readonly AstroIntegration[],
): AstroIntegration | undefined {
  const isConfigured = integrations.some(
    (integration) => integration.name === COMPONENTS_INTEGRATION_NAME,
  );

  return isConfigured ? undefined : proseflyComponents();
}
