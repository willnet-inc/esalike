const product = process.env.PUPPETEER_PRODUCT || 'chrome'

module.exports = {
  launch: {
    dumpio: true,
    headless: true,
    product
  },
  server: {
    command: 'npm run test:serve',
    port: 3001,
    launchTimeout: 5000 * 5 // Default value(5000) was not enough on CI
  }
}
