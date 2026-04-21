import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'http://testurl.com',
  likes: 5,
  user: {
    username: 'testuser',
    name: 'Test User'
  }
}

const mockUser = {
  username: 'testuser',
  name: 'Test User'
}

// Tehtävä 5.13
test('renders title and author but not url or likes by default', () => {
  render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} user={mockUser} />)

  expect(screen.getByText('Test Blog Title Test Author')).toBeDefined()
  expect(screen.queryByText('http://testurl.com')).toBeNull()
  expect(screen.queryByText('likes 5')).toBeNull()
})

// Tehtävä 5.14
test('shows url, likes and user after view button is clicked', async () => {
  render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} user={mockUser} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('http://testurl.com')).toBeDefined()
  expect(screen.getByText('likes 5')).toBeDefined()
  expect(screen.getByText('Test User')).toBeDefined()
})

// Tehtävä 5.15
test('like button calls event handler twice when clicked twice', async () => {
  const mockHandleLike = vi.fn()
  render(<Blog blog={blog} handleLike={mockHandleLike} handleDelete={() => {}} user={mockUser} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandleLike.mock.calls).toHaveLength(2)
})
