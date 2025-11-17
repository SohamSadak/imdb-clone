import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. Lazy State Initialization
  // We check localStorage immediately so the user sees data on first load.
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes-data');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [inputValue, setInputValue] = useState("");

  // 2. useEffect for Persistence
  // This runs every time 'notes' changes to save the data.
  useEffect(() => {
    localStorage.setItem('notes-data', JSON.stringify(notes));
  }, [notes]);

  // 3. Add Note Handler
  const addNote = () => {
    if (!inputValue.trim()) return; // Prevent empty notes

    const newNote = {
      id: Date.now(),
      text: inputValue
    };

    setNotes([...notes, newNote]); // Add to array
    setInputValue(""); // Clear input
  };

  // 4. Delete Note Handler
  const deleteNote = (idToDelete) => {
    setNotes(notes.filter(note => note.id !== idToDelete));
  };

  return (
    <div className="app-container">
      <h1>Sticky Notes</h1>
      
      {/* Input Section */}
      <div className="input-group">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
          placeholder="What needs to be done?"
        />
        <button onClick={addNote} className="add-btn">Add</button>
      </div>

      {/* Notes List */}
      <ul className="notes-list">
        {notes.length === 0 && <p className="empty-state">No notes yet...</p>}
        
        {notes.map(note => (
          <li key={note.id} className="note-item">
            <span>{note.text}</span>
            <button onClick={() => deleteNote(note.id)} className="delete-btn">
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App