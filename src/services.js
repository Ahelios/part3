import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

function getAllPersons () {
  const request = axios.get(baseUrl)

  return request.then(response => response)
}

function createPerson(newPerson){

  const request = axios.post(baseUrl, newPerson)
  return request.then(response => response)
}

function deletePerson(id){
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response)
}

export default { getAllPersons, createPerson, deletePerson }