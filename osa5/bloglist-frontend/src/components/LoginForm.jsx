import { TextField, Button, Paper, Typography, Box } from '@mui/material'

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Log in to application</Typography>
        <form onSubmit={handleLogin}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </Box>
          <Button type="submit" variant="contained" fullWidth>
            login
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default LoginForm
