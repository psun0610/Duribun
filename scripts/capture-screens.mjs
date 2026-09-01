import { mkdirSync } from 'node:fs'

import { chromium } from 'playwright'

const BASE_URL = process.env.CAPTURE_BASE_URL ?? 'http://localhost:3000'
const OUT_DIR = 'artifacts/screens'

// 개발 서버의 Next.js 표시 뱃지가 화면 왼쪽 아래를 가려서 감춥니다.
const HIDE_DEV_BADGE = 'nextjs-portal { display: none !important; }'

const TARGETS = [
    { name: '01-landing', path: '/' },
    { name: '02-login', path: '/login' },
    { name: '03-places-feed', path: '/dev/ui-preview?screen=places-feed' },
    { name: '04-places-list', path: '/dev/ui-preview?screen=places-list' },
    { name: '05-places-empty', path: '/dev/ui-preview?screen=places-empty' },
    { name: '06-place-new', path: '/dev/ui-preview?screen=place-new' },
    {
        name: '07-place-new-results',
        path: '/dev/ui-preview?screen=place-new',
        async setup(page) {
            await page.fill('input[name="query"]', '브런치')
            await page.press('input[name="query"]', 'Enter')
            await page.waitForTimeout(2500)

            const firstResult = page.locator('button[aria-pressed]').first()

            if (await firstResult.count()) {
                await firstResult.click()
                await page.waitForTimeout(400)
            }
        },
    },
    {
        name: '08-place-new-manual',
        path: '/dev/ui-preview?screen=place-new',
        async setup(page) {
            await page.getByRole('tab', { name: '직접 적기' }).click()
            await page.waitForTimeout(500)
        },
    },
    { name: '09-review-writer', path: '/dev/ui-preview?screen=review-writer' },
    {
        name: '10-review-writer-filled',
        path: '/dev/ui-preview?screen=review-writer',
        async setup(page) {
            const sliders = page.locator('[role="slider"]')
            const count = await sliders.count()

            for (let index = 0; index < count; index += 1) {
                const box = await sliders.nth(index).boundingBox()

                if (box) {
                    await page.mouse.click(
                        box.x + box.width * 0.82,
                        box.y + box.height / 2
                    )
                }
            }

            await page
                .locator('textarea[name="oneLineReview"]')
                .fill('창가 자리가 최고. 햇살이 너무 예뻤던 날')
            await page.getByText('분위기', { exact: true }).first().click()
            await page.getByText('뷰', { exact: true }).first().click()
            await page.waitForTimeout(400)
        },
    },
    {
        name: '11-review-writer-bottom',
        path: '/dev/ui-preview?screen=review-writer',
        async setup(page) {
            await page.locator('form').evaluate(form => {
                form.parentElement?.scrollTo(0, form.scrollHeight)
            })
            await page.waitForTimeout(400)
        },
    },
    { name: '12-review-detail', path: '/dev/ui-preview?screen=review-detail' },
]

mkdirSync(OUT_DIR, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({
    deviceScaleFactor: 2,
    viewport: { height: 900, width: 390 },
})

const consoleErrors = []
page.on('console', message => {
    if (message.type() === 'error') {
        consoleErrors.push(message.text())
    }
})

const results = []

for (const target of TARGETS) {
    consoleErrors.length = 0
    await page.goto(`${BASE_URL}${target.path}`, { waitUntil: 'networkidle' })
    await page.addStyleTag({ content: HIDE_DEV_BADGE })
    await page.waitForTimeout(500)

    let setupError = null

    if (target.setup) {
        try {
            await target.setup(page)
        } catch (error) {
            setupError = String(error).split('\n')[0]
        }
    }

    await page.screenshot({
        fullPage: true,
        path: `${OUT_DIR}/${target.name}.png`,
    })

    results.push({
        errors: [...consoleErrors],
        screen: target.name,
        setupError,
    })
}

console.log(JSON.stringify(results, null, 2))

await browser.close()
