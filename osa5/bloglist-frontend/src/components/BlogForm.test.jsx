import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

// Tehtävä 5.16
test('form calls createBlog with correct details when submitted', async () => {
  const mockCreateBlog = vi.fn()
  render(<BlogForm createBlog={mockCreateBlog} />)

  const user = userEvent.setup()

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')

  await user.type(titleInput, 'Test Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://test.com')

  const submitButton = screen.getByText('create')
  await user.click(submitButton)

  expect(mockCreateBlog.mock.calls).toHaveLength(1)
  expect(mockCreateBlog.mock.calls[0][0].title).toBe('Test Title')
  expect(mockCreateBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(mockCreateBlog.mock.calls[0][0].url).toBe('http://test.com')
})
