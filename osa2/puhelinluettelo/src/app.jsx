import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ value, onChange }) => (
  <div>filter shown with: <input value={value} onChange={onChange} /></div>
)

const PersonForm = ({ onSubmit, nameValue, nameOnChange, numberValue, numberOnChange }) => (
  <form onSubmit={onSubmit}>
    <div>name: <input value={nameValue} onChange={nameOnChange} /></div>
    <div>number: <input value={numberValue} onChange={numberOnChange} /></div>
    <div><button type="submit">add</button></div>
  </form>
)

const Persons = ({ persons }) => (
  <div>
    {persons.map(person =>
      <p key={person.id}>{person.name} {person.number}</p>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then(response => {
      setPersons(response.data)
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (persons.find(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat({ name: newName, number: newNumber }))
    setNewName('')
    setNewNumber('')
  }

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={e => setFilter(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={handleSubmit}
        nameValue={newName}
        nameOnChange={e => setNewName(e.target.value)}
        numberValue={newNumber}
        numberOnChange={e => setNewNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <Persons persons={filtered} />
    </div>
  )
}

export default App
npm run dev
