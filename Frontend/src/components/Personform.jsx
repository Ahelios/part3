import React from 'react';
import { useState } from 'react';
import services from '../services';

function Personform({ handleSetPersons, persons }) {
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');

	function handleSetNewName(event) {
		setNewName(event.target.value);
	}

	function handleSetNewNumber(event) {
		setNewNumber(event.target.value);
	}

	function handleSubmit() {
		event.preventDefault();
		const newPerson = { name: newName, number: newNumber };

		const nameExists = persons.some((person) => person.name === newPerson.name);

		if (nameExists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
				const existingPerson = persons.find(person => newPerson.name === person.name)
				console.log('Existing person:', existingPerson);

        services.updatePersonsNumber(existingPerson.id, newPerson)
          .then(response => {
						handleSetPersons(response.data);
            setNewName('');
            setNewNumber('');
          });
      }
    } else {
      services.createPerson(newPerson)
        .then(response => {
          handleSetPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');
        });
    }
  }

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div>
					name: <input value={newName} onChange={handleSetNewName} />
				</div>
				<div>
					number: <input value={newNumber} onChange={handleSetNewNumber} />
				</div>
				<div>
					<button type="submit">add</button>
				</div>
			</form>
		</>
	);
}

export default Personform;
