import { expect, test } from '@playwright/test'

test.describe('home page', () => {
  test('renders key sections and supports skip link', async ({ page }) => {
    await page.goto('/')

    const heroHeading = page.getByRole('heading', {
      name: /Ingeniero de software|Software Engineer/i,
    })
    await expect(heroHeading).toBeVisible()

    const skipLink = page.getByRole('link', { name: /Saltar al contenido|Skip to content/i })
    await skipLink.focus()
    await expect(skipLink).toBeVisible()
  })

  test('keeps footer visual stable', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer').last()
    await expect(footer).toBeVisible()
    await expect(footer).toHaveScreenshot('home-footer.png', {
      animations: 'disabled',
      scale: 'css',
    })
  })
})
