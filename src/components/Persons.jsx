import axios from 'axios'
import services from '../services.js'

function Persons({ persons, onDelete }) {


  return (
    <>
      {persons.map((person, ) => (
        <div key={person.id}>
          {person.name}-{person.number}
          <button onClick={() => {onDelete(person.id)}}>Delete</button>
        </div>
      ))}
    </>
  )
}

export default Persons