import { chromium } from 'playwright'

const context = await chromium.launchPersistentContext(
    'artifacts/playwright-profile',
    {
        channel: 'chrome',
        headless: false,
        viewport: {
            height: 920,
            width: 430,
        },
    }
)

const page = context.pages()[0] ?? (await context.newPage())
const cdpSession = await context.newCDPSession(page)
await cdpSession.send('Network.clearBrowserCache')

await page.goto('http://localhost:3000/app', {
    waitUntil: 'networkidle',
})
await page.reload({
    waitUntil: 'networkidle',
})
await page.waitForLoadState('domcontentloaded')
await page.waitForTimeout(1200)

const diagnostics = await page.evaluate(() => {
    return {
        className: document.querySelector('main')?.className ?? '',
        stylesheetCount: document.styleSheets.length,
        title: document.title,
    }
})

await page.screenshot({
    fullPage: true,
    path: 'artifacts/app-auth-screen.png',
})

console.log(JSON.stringify({ url: page.url(), ...diagnostics }))

await context.close()
