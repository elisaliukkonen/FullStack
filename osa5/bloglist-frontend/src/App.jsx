import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import NewBlog from './components/NewBlog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type }) => {
  if (!message) return null
  const style = {
    background: type === 'error' ? '#ffdddd' : '#ddffdd',
    border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 18
  }
  return <div style={style}>{message}</div>
}

const Navigation = ({ user, handleLogout }) => {
  const padding = { padding: 5 }
  return (
    <div style={{ background: '#f0f0f0', padding: 10, marginBottom: 10 }}>
      <Link style={padding} to="/">blogs</Link>
      {user && <Link style={padding} to="/create">create new</Link>}
      {user
        ? <span>{user.name} logged in <button onClick={handleLogout}>logout</button></span>
        : <Link style={padding} to="/login">login</Link>
      }
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notify(`Welcome ${user.name}!`)
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreateBlog = async ({ title, author, url }, navigate) => {
    try {
      await blogService.create({ title, author, url })
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      notify(`a new blog ${title} by ${author} added`)
      navigate('/')
    } catch {
      notify('error creating blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : null
    }
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id === blog.id
        ? { ...returnedBlog, user: blog.user }
        : b))
    } catch {
      notify('error updating blog', 'error')
    }
  }

  const handleDelete = async (blog, navigate) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notify(`Blog ${blog.title} deleted`)
        navigate('/')
      } catch {
        notify('error deleting blog', 'error')
      }
    }
  }

  const BlogViewWrapper = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const blog = blogs.find(b => b.id === id)
    return (
      <BlogView
        blog={blog}
        handleLike={handleLike}
        handleDelete={(blog) => handleDelete(blog, navigate)}
        user={user}
      />
    )
  }

  const NewBlogWrapper = () => {
    const navigate = useNavigate()
    return <NewBlog createBlog={(data) => handleCreateBlog(data, navigate)} />
  }

  return (
    <Router>
      <Navigation user={user} handleLogout={handleLogout} />
      <Notification message={notification} type={notificationType} />

      <Routes>
        <Route path="/login" element={
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        } />
        <Route path="/blogs/:id" element={<BlogViewWrapper />} />
        <Route path="/create" element={<NewBlogWrapper />} />
        <Route path="/" element={
          <BlogList
            blogs={blogs}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        } />
      </Routes>
    </Router>
  )
}

export default App
