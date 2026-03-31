const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { id: 1, name: 'Maija Maitoparta', number: '040-123456' },
  { id: 2, name: 'Heikki Heiluri', number: '020-5323523' },
  { id: 3, name: 'Aukku Apinanen', number: '050-234345' },
  { id: 4, name: 'Siika Oksanen', number: '045-642122' }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === Number(req.params.id))
  if (person) res.json(person)
  else res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(p => p.id !== Number(req.params.id))
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }
  if (persons.find(p => p.name === name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }
  const person = { id: Math.floor(Math.random() * 1000000), name, number }
  persons = persons.concat(person)
  res.json(person)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
