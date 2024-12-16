import axios from 'axios'

const baseUrl = '/api/persons'

function getAllPersons () {
  const request = axios.get(baseUrl)
  console.log('Making request to:', baseUrl)
  return request.then(response => response)
}

function createPerson(newPerson){
  console.log(newPerson)
  const request = axios.post(baseUrl, newPerson)
  return request.then(response => response)
}

function updatePersonsNumber(id, newPerson){
  const request = axios.put(`${baseUrl}/${id}`, newPerson)
  return request.then(response => {
    console.log('Update response:', response.data);
    return response;
  });
}

function deletePerson(id){
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response)
}

export default { getAllPersons, createPerson, deletePerson, updatePersonsNumber }