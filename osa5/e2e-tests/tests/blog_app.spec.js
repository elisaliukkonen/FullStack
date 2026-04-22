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
    await page.goto('http://localhost:5173/login')
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByRole('textbox').first()).toBeVisible()
    await expect(page.getByRole('textbox').last()).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login')
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.goto('http://localhost:5173/create')
      await page.getByPlaceholder('title').fill('Test Blog')
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForURL('http://localhost:5173/')
      await expect(page.getByRole('link', { name: 'Test Blog' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.goto('http://localhost:5173/create')
      await page.getByPlaceholder('title').fill('Test Blog')
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForURL('http://localhost:5173/')
      await expect(page.getByRole('link', { name: 'Test Blog' })).toBeVisible()
      await page.getByRole('link', { name: 'Test Blog' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user who added blog can delete it', async ({ page }) => {
      await page.goto('http://localhost:5173/create')
      await page.getByPlaceholder('title').fill('Test Blog')
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForURL('http://localhost:5173/')
      await expect(page.getByRole('link', { name: 'Test Blog' })).toBeVisible()
      await page.getByRole('link', { name: 'Test Blog' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()
      await page.waitForURL('http://localhost:5173/')
      await expect(page.getByRole('link', { name: 'Test Blog' })).not.toBeVisible()
    })
  })
})
