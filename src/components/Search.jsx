import React from 'react'
import { useState } from 'react'

function Search({handleSetSearchedValue}) {
  const [inputValue, setInputValue] = useState('');

  function handleSetSearchedName(event) {
		const value = event.target.value;
		setInputValue(value);
    handleSetSearchedValue(value.toLowerCase());
	}

  return (
    <input value={inputValue} onChange={handleSetSearchedName} />
  )
}

export default Search