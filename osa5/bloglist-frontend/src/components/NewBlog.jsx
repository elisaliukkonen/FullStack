import BlogForm from './BlogForm'

const NewBlog = ({ createBlog }) => {
  return (
    <div>
      <h2>create new blog</h2>
      <BlogForm createBlog={createBlog} />
    </div>
  )
}

export default NewBlog
