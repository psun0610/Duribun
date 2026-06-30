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
await page.waitForTimeout(1000)

const result = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('main, section, div, button')).slice(0, 40)

    return {
        bodyClassName: document.body.className,
        elements: elements.map(element => ({
            className: element.className,
            tagName: element.tagName,
            text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80),
        })),
        stylesheets: Array.from(document.styleSheets).map(sheet => sheet.href ?? 'inline'),
        url: location.href,
    }
})

console.log(JSON.stringify(result, null, 2))

await context.close()
