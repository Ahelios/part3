import React from 'react';
import { useState } from 'react';
import services from '../services';

function Personform({ handleSetPersons }) {
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

		services.createPerson(newPerson)
		.then((response) => {
			console.log(response.data)
			handleSetPersons({
				name: newName,
				number: newNumber,
				id: response.data.id
			});
			setNewName('');   
      setNewNumber(''); 
		});
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
