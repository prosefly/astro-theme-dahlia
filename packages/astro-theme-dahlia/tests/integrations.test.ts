import proseflyComponents, {
  COMPONENTS_INTEGRATION_NAME,
} from '@prosefly/astro-components/integration';
import { describe, expect, it } from 'vitest';
import { createDefaultComponentsIntegration } from '../src/lib/integrations';

describe('integration defaults', () => {
  it('creates the default Astro Components integration when it is missing', () => {
    expect(createDefaultComponentsIntegration([])?.name).toBe(
      COMPONENTS_INTEGRATION_NAME,
    );
  });

  it('preserves a user-configured Astro Components integration', () => {
    const configuredIntegration = proseflyComponents({
      markdown: {
        mermaid: false,
      },
    });

    expect(createDefaultComponentsIntegration([configuredIntegration])).toBeUndefined();
  });
});
