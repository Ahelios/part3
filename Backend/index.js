const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path')
require('dotenv').config()
const Person = require('./models/person')

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'))

// MongoDB connection
mongoose.set('strictQuery', false);
const url = process.env.MONGODB_URI;
console.log('connecting to', url);

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
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

  if(!(body.name) || !(body.number)){
    return response.status(400).json({
      error: 'name or number missing'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => {
      response.status(500).json({ error: 'failed to save person' });
    });

});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})