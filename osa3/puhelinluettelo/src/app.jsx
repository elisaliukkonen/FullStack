import { useState, useEffect } from 'react'
import personService from './personService'

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

const Persons = ({ persons, onDelete }) => (
  <div>
    {persons.map(person =>
      <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => onDelete(person)}>delete</button>
      </p>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const notify = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    personService.getAll().then(data => setPersons(data))
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const existing = persons.find(p => p.name === newName)
    if (existing) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService.update(existing.id, { ...existing, number: newNumber })
          .then(updated => {
            setPersons(persons.map(p => p.id === existing.id ? updated : p))
            setNewName('')
            setNewNumber('')
            notify(`Updated ${newName}`)
          })
          .catch(() => {
            notify(`${newName} was already removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== existing.id))
          })
      }
      return
    }
    personService.create({ name: newName, number: newNumber })
      .then(added => {
        setPersons(persons.concat(added))
        setNewName('')
        setNewNumber('')
        notify(`Added ${newName}`)
      })
      .catch(error => {
        notify(error.response.data.error, 'error')
      })
  }

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          notify(`Deleted ${person.name}`)
        })
        .catch(() => {
          notify(`${person.name} was already removed from server`, 'error')
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
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
      <Persons persons={filtered} onDelete={handleDelete} />
    </div>
  )
}

export default App
git push
