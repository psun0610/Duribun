import { chromium } from 'playwright'

const userDataDir = 'artifacts/playwright-profile'
const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chrome',
    headless: false,
    viewport: {
        height: 920,
        width: 430,
    },
})

const page = context.pages()[0] ?? (await context.newPage())
await page.goto('http://localhost:3000/app')

console.log('Opened http://localhost:3000/app')
console.log('Log in in the opened browser if redirected, then keep the app page open.')

await page.waitForTimeout(10 * 60 * 1000)
await context.close()
