const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
  }
]

const generateId = () => {
  const maxId = (persons.length > 0)
    ? Math.max(...persons.map(p => Number(p.id)))
    : 0
    
  return String(maxId + 1)
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const currentTime = new Date().toString();

  const responseText = `
    Phonebook has info for ${persons.length} people.
    <br/>
    <br/>
    ${currentTime}
  `

  response.send(responseText);
})

app.get('/api/persons/:id', (request, response) => {
  const searchedId = request.params.id;

  const searchedPerson = persons.find(person => person.id === searchedId)

  if (searchedPerson) {
    return response.json(searchedPerson)
  } else {
    return response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const searchedId = request.params.id
  persons = persons.filter(person => person.id !== searchedId)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const nameExists = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())

  if(!(body.name) || !(body.number)){
    return response.status(400).json({
      error: 'Bad request, no number or name provided'
    }).end()
  } else if(nameExists){
    return response.status(400).json({
      error: 'Name already exists'
    }).end()
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(newPerson);

  console.log(JSON.stringify(newPerson));
  response.status(201).json(newPerson)

});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})