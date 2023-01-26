import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'ca4jv5',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
