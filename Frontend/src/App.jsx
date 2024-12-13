import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import Personform from './components/Personform';
import Search from './components/Search';
import "./index.css";
import services from './services'
import Notification from './components/Notification';

function App() {
	const [persons, setPersons] = useState([]);
	const [searchedValue, setSearchedValue] = useState('');
	const [Error, setError] = useState(
		{
			isError : false,
			message : null
		}
	);

	useEffect(() => {
		services.getAllPersons()
		.then((response) => {
			setPersons(response.data);
			console.log(`This is the list of persons returned upon first render `, response.data);
		});
	}, []);

	function handleSetPersons(updatedPerson) {
		if (Array.isArray(updatedPerson)) {
			setPersons(updatedPerson);
		} else {
			const existingIndex = persons.findIndex(p => p.id === updatedPerson.id);
			if (existingIndex !== -1) {
				const newPersons = [...persons];
				newPersons[existingIndex] = updatedPerson;
				setPersons(newPersons);
			} else {
				setPersons([...persons, updatedPerson]);
			}
		}
	}

	function handleSetSearchedValue(value) {
		setSearchedValue(value);
	}

	function handleDeletePerson(id){
		const personToDelete = persons.find(person => person.id === id);

		if(window.confirm(`Are you sure you want to delete ${personToDelete.name}?`)){
			console.log(personToDelete)
		services.deletePerson(id)
		.then(() => {
			setPersons(persons.filter(person => person.id !== id))
			setError({
				isError: false,
				message: personToDelete.name + "has been deleted"
			})
		})
		.finally(() => {
			setTimeout(() => {
				setError({ message: null, isError: false })
			}, 5000)
		})
	}
	}

	const filteredPersons = filterPersons(searchedValue);

	function filterPersons(value) {
		if (!value) return persons;

		return persons.filter(
			(person) =>
				person.name.toLowerCase().includes(value) ||
				person.number.includes(value)
		);
	}

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification isError={Error.isError} message={Error.message}/>
			<Search handleSetSearchedValue={handleSetSearchedValue} />
			<h2>Add new contact</h2>
			<Personform handleSetPersons={handleSetPersons} persons={persons}/>
			<h2>Numbers</h2>
			<Persons persons={filteredPersons} onDelete={handleDeletePerson}/>
		</div>
	);
}

export default App;
