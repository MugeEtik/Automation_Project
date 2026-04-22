const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const addCucumberPreprocessorPlugin = require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;

require('dotenv').config();
// Artık process.env.VALID_EMAIL diyerek bu veriye ulaşabiliriz.

module.exports = defineConfig({
  projectId: 'dvsq5u',

  reporter: 'cypress-mochawesome-reporter', // Raporlama motoru
  
  e2e: {
    baseUrl: "https://www.kitapsepeti.com",

    specPattern: "cypress/e2e/features/*.feature", // Sadece feature dosyalarını gör
    
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    defaultCommandTimeout: 10000,

    async setupNodeEvents(on, config) {
      // Cucumber eklentisini sisteme tanıtıyoruz
      await addCucumberPreprocessorPlugin(on, config);

      console.log(process.env.VALID_EMAIL); // .env dosyasındaki değeri kontrol amaçlı yazdırıyoruz
      console.log(process.env.VALID_PASSWORD); // .env dosyasındaki değeri kontrol amaçlı yazdırıyoruz

      require('cypress-mochawesome-reporter/plugin')(on);

    // KRİTİK ADIM: .env içindeki verileri Cypress'in anlayacağı formata sokuyoruz
      config.env.VALID_EMAIL = process.env.VALID_EMAIL;
      config.env.VALID_PASSWORD = process.env.VALID_PASSWORD;

      // esbuild motorunu (bundler) devreye alıyoruz
      on("file:preprocessor", createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },
  },
});