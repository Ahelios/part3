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

	const showNotification = (message, isError = false) => {
    setError({ isError, message });
    setTimeout(() => {
      setError({ isError: false, message: null });
    }, 5000);
  };

	function handleSetPersons(updatedPerson) {
		if (Array.isArray(updatedPerson)) {
			setPersons(updatedPerson);
		} else {
			const existingIndex = persons.findIndex(p => p.id === updatedPerson.id);
			if (existingIndex !== -1) {
				const newPersons = [...persons];
				newPersons[existingIndex] = updatedPerson;
				setPersons(newPersons);
				showNotification(`${updatedPerson.name} has been updated.`);
			} else {
				setPersons([...persons, updatedPerson]);
				showNotification(`${updatedPerson.name} has been added.`);
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
			showNotification(`${personToDelete.name} has been deleted`);
		})
		.catch(error => {
			showNotification(`Error deleting ${personToDelete.name}`, true);
		});
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
			<Personform handleSetPersons={handleSetPersons} persons={persons} setError={setError} showNotification={showNotification}/>
			<h2>Numbers</h2>
			<Persons persons={filteredPersons} onDelete={handleDeletePerson}/>
		</div>
	);
}

export default App;
