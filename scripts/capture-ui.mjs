import { chromium } from 'playwright'

const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
})

const page = await browser.newPage({
    viewport: {
        height: 920,
        width: 430,
    },
})

await page.goto('http://localhost:3000/app', {
    waitUntil: 'networkidle',
})

await page.screenshot({
    fullPage: true,
    path: 'artifacts/app-screen.png',
})

console.log(page.url())

await browser.close()
