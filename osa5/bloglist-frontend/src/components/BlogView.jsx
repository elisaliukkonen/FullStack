import { useNavigate } from 'react-router-dom'

const BlogView = ({ blog, handleLike, handleDelete, user }) => {
  const navigate = useNavigate()

  if (!blog) return null

  const showDelete = user && blog.user && user.username === blog.user.username

  const handleDeleteAndNavigate = async (blog) => {
    await handleDelete(blog)
    navigate('/')
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        likes {blog.likes}
        {user && <button onClick={() => handleLike(blog)}>like</button>}
      </div>
      <div>added by {blog.user ? blog.user.name : ''}</div>
      {showDelete && (
        <button onClick={() => handleDeleteAndNavigate(blog)}>delete</button>
      )}
      <button onClick={() => navigate('/')}>back</button>
    </div>
  )
}

export default BlogView
