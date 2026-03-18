import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Kun kaikki GitHubissa, kirjoita terminaaliin:
```
cd C:\Users\elisa\OneDrive\Työpöytä\FullStack
git pull
cd osa2/maiden-tiedot
npm install
($env:VITE_WEATHER_KEY="8604c9ce25036c98fb1b2e16b49988c5") -and (npm run dev)
