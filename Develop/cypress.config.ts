import { defineConfig } from 'cypress';
import { devServer } from '@cypress/vite-dev-server';
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        configFile: path.resolve('./vite.config.ts')
      }
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },

  viewportWidth: 1280,
  viewportHeight: 720
});