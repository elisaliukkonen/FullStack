import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BlogView from './BlogView'

const blog = {
  id: '123',
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

const otherUser = {
  username: 'otheruser',
  name: 'Other User'
}

test('shows blog details but no buttons for logged out user', () => {
  render(
    <MemoryRouter>
      <BlogView blog={blog} handleLike={() => {}} handleDelete={() => {}} user={null} />
    </MemoryRouter>
  )
  expect(screen.getByText('Test Blog Title by Test Author')).toBeDefined()
  expect(screen.getByText('http://testurl.com')).toBeDefined()
  expect(screen.getByText('likes 5')).toBeDefined()
  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('delete')).toBeNull()
})

test('shows only like button for logged in user who is not creator', () => {
  render(
    <MemoryRouter>
      <BlogView blog={blog} handleLike={() => {}} handleDelete={() => {}} user={otherUser} />
    </MemoryRouter>
  )
  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('delete')).toBeNull()
})

test('shows delete button for blog creator', () => {
  render(
    <MemoryRouter>
      <BlogView blog={blog} handleLike={() => {}} handleDelete={() => {}} user={mockUser} />
    </MemoryRouter>
  )
  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('delete')).toBeDefined()
})

test('like button calls event handler twice when clicked twice', async () => {
  const mockHandleLike = vi.fn()
  render(
    <MemoryRouter>
      <BlogView blog={blog} handleLike={mockHandleLike} handleDelete={() => {}} user={mockUser} />
    </MemoryRouter>
  )
  const user = userEvent.setup()
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandleLike.mock.calls).toHaveLength(2)
})
