import { useNavigate } from 'react-router-dom'
import { Paper, Typography, Button, Box } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const BlogView = ({ blog, handleLike, handleDelete, user }) => {
  const navigate = useNavigate()

  if (!blog) return null

  const showDelete = user && blog.user && user.username === blog.user.username

  const handleDeleteAndNavigate = async (blog) => {
    await handleDelete(blog)
    navigate('/')
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, width: 600 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>{blog.title}</Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>by {blog.author}</Typography>
        <Typography sx={{ mb: 1 }}>
          <a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a>
        </Typography>
        <Typography sx={{ mb: 2 }}>likes {blog.likes}</Typography>
        <Typography sx={{ mb: 2 }}>added by {blog.user ? blog.user.name : ''}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {user && (
            <Button
              variant="contained"
              startIcon={<ThumbUpIcon />}
              onClick={() => handleLike(blog)}
            >
              like
            </Button>
          )}
          {showDelete && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteAndNavigate(blog)}
            >
              delete
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
          >
            back
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default BlogView
