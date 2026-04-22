import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Button, Alert, Container } from '@mui/material'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import NewBlog from './components/NewBlog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type }) => {
  if (!message) return null
  return (
    <Alert severity={type === 'error' ? 'error' : 'success'} sx={{ mb: 2 }}>
      {message}
    </Alert>
  )
}

const Navigation = ({ user, handleLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">blogs</Button>
        {user && <Button color="inherit" component={Link} to="/create">create new</Button>}
        {user
          ? <span style={{ marginLeft: 'auto' }}>
              {user.name} logged in
              <Button color="inherit" onClick={handleLogout}>logout</Button>
            </span>
          : <Button color="inherit" component={Link} to="/login" sx={{ marginLeft: 'auto' }}>login</Button>
        }
      </Toolbar>
    </AppBar>
  )
}

const BlogsPage = ({ blogs, setBlogs, handleLike, handleDelete, user }) => {
  const location = useLocation()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [location])

  return (
    <BlogList
      blogs={blogs}
      handleLike={handleLike}
      handleDelete={handleDelete}
      user={user}
    />
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
      <Container sx={{ mt: 2 }}>
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
            <BlogsPage
              blogs={blogs}
              setBlogs={setBlogs}
              handleLike={handleLike}
              handleDelete={handleDelete}
              user={user}
            />
          } />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
