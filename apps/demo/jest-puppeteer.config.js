// jest-puppeteer.config.js
module.exports = {
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false',
    product: 'chrome',
  },
  browserContext: 'default',
  server: {
    command: 'npm run test:serve',
    port: 3001
  }
}
