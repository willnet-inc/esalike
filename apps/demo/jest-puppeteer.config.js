// jest-puppeteer.config.js
module.exports = {
  launch: {
    dumpio: true,
    headless: true,
    product: 'chrome',
  },
  browserContext: 'default',
  server: {
    command: 'npm run test:serve',
    port: 3001
  }
}
