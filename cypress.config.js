const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const addCucumberPreprocessorPlugin = require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;

require('dotenv').config();
// Artık process.env.VALID_EMAIL diyerek bu veriye ulaşabiliriz.

module.exports = defineConfig({
  //projectId: sonra eklenebilir, şimdilik local testler yapacağız
  e2e: {
    baseUrl: "https://www.kitapsepeti.com",

    specPattern: "cypress/e2e/features/*.feature", // Sadece feature dosyalarını gör
    
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // Şimdilik sistemi yormayalım
    defaultCommandTimeout: 10000,

    async setupNodeEvents(on, config) {
      // Cucumber eklentisini sisteme tanıtıyoruz
      await addCucumberPreprocessorPlugin(on, config);

      // esbuild motorunu (bundler) devreye alıyoruz
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },
  },
});