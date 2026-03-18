import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital, apiKey }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
      .then(r => setWeather(r.data))
  }, [capital])

  if (!weather) return null

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const Country = ({ country, apiKey }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>capital {country.capital?.[0]}</p>
    <p>area {country.area}</p>
    <h3>languages</h3>
    <ul>
      {Object.values(country.languages || {}).map(lang => <li key={lang}>{lang}</li>)}
    </ul>
    <img src={country.flags.png} alt={`flag of ${country.name.common}`} width={150} />
    <Weather capital={country.capital?.[0]} apiKey={apiKey} />
  </div>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(r => setCountries(r.data))
  }, [])

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    setSelected(null)
  }

  const content = () => {
    if (selected) return <Country country={selected} apiKey={apiKey} />
    if (filtered.length > 10) return <p>Too many matches, specify another filter</p>
    if (filtered.length === 1) return <Country country={filtered[0]} apiKey={apiKey} />
    return filtered.map(c => (
      <div key={c.name.common}>
        {c.name.common}
        <button onClick={() => setSelected(c)}>show</button>
      </div>
    ))
  }

  return (
    <div>
      <div>find countries <input value={filter} onChange={handleFilterChange} /></div>
      {content()}
    </div>
  )
}

export default App
