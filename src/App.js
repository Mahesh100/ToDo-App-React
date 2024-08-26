import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/items/getAllItems`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Ensure data is an array and has the correct format
      if (Array.isArray(data)) {
        console.log('Fetched items:', data);
        setItems(data); // Update the state with the list of items
      } else {
        console.error('Expected an array but got:', data);
        setItems([]); // Set an empty array if the data format is incorrect
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]); // Set an empty array if there's an error
    }
  };


  const addItem = async () => {
    if (!name.trim()) return; // Avoid adding empty or whitespace-only names

    const item = { itemName: name.trim() }; // Ensure the key matches Item class field
    console.log('Adding item:', item);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/items/addItem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const newItem = await response.json();
        console.log('Item added:', newItem);
        setMessage('Item added successfully!');
        setName('');
        fetchItems(); // Refresh the list of items
      } else {
        console.error('Failed to add item, response:', response);
        setMessage('Failed to add item.');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setMessage('Failed to add item.');
    }
  };



  return (
    <div className="App">
      <h1>Item List</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item Name"
      />
      <button onClick={addItem}>Add Item</button>
      {message && <p>{message}</p>}

      <ul>
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => (
            <li key={item.id}>{item.itemName}</li>
          ))
        ) : (
          <li>No items found</li>
        )}
      </ul>

    </div>
  );
}

export default App;
