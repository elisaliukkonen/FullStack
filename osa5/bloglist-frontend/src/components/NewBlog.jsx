import { TextField, Button, Paper, Typography, Box } from '@mui/material'
import { useState } from 'react'

const NewBlog = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>create new blog</Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="title"
              value={title}
              placeholder="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="author"
              value={author}
              placeholder="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="url"
              value={url}
              placeholder="url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </Box>
          <Button type="submit" variant="contained" fullWidth>
            create
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default NewBlog
