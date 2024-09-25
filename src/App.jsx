import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  const submitQuery = (e) => {
    e.preventDefault();
    setSubmittedQuery(query);
    setQuery('');
  }

  // OpenAI App
  return (
    <>
      <h1>Query: {submittedQuery && submittedQuery}</h1>
      <form onSubmit={submitQuery}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
        <input type='submit' value={'Submit'} />
      </form>
    </>
  )
}

export default App
