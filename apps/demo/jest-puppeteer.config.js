module.exports = {
  launch: {
    headless: 'new',
    product: 'chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  },
  server: {
    command: 'npm run test:serve',
    port: 3001,
    launchTimeout: 5000 * 5 // Default value(5000) was not enough on CI
  }
}
