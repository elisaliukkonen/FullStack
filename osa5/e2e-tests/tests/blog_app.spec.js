const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Test Blog')
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Test Blog Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Test Blog')
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Test Blog Test Author')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user who added blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Test Blog')
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Test Blog Test Author')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()
      await expect(page.getByText('Test Blog Test Author')).not.toBeVisible()
    })

    test('only the blog creator sees delete button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Other User',
          username: 'otheruser',
          password: 'password'
        }
      })
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Test Blog')
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Test Blog Test Author')).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()
      await page.getByRole('textbox').first().fill('otheruser')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Other User logged in')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await expect(page.getByPlaceholder('title')).toBeVisible()
      await page.getByPlaceholder('title').fill('First Blog')
      await page.getByPlaceholder('author').fill('Author')
      await page.getByPlaceholder('url').fill('http://first.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('First Blog Author')).toBeVisible()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await expect(page.getByPlaceholder('title')).toBeVisible()
      await page.getByPlaceholder('title').fill('Second Blog')
      await page.getByPlaceholder('author').fill('Author')
      await page.getByPlaceholder('url').fill('http://second.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Second Blog Author')).toBeVisible()

      const viewButtons = page.getByRole('button', { name: 'view' })
      await viewButtons.nth(1).click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()

      const blogs = page.locator('[style*="border"]')
      await expect(blogs.first()).toContainText('Second Blog')
    })
  })
})
