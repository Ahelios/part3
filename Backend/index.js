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
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

mongoose.set('strictQuery', false);
const url = process.env.MONGODB_URI;
console.log('connecting to', url);

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('MongoDB Connection Error Details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
  });

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date().toString();
      const responseText = `
        Phonebook has info for ${count} people.
        <br/>
        <br/>
        ${currentTime}
      `;
      response.send(responseText);
    })
    .catch(error => next(error))
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        return response.json(person)
      } else {
        return response.status(404).end()
      }
    })
    .catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'person not found' })
      }
    })
    .catch(error => {
      console.log('Error deleting person:', error.message)
      response.status(500).json({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if(!(body.name) || !(body.number)){
    return response.status(400).json({
      error: 'name or number missing'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});


const errorHandler = (error, request, response, next) => {
  console.error('Detailed Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    path: request.path,
    method: request.method,
    body: request.body
  });

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'MongooseError') {
    return response.status(500).json({ error: 'Database connection error' });
  }
  
  response.status(500).json({ error: 'Something went wrong' });
  // next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})