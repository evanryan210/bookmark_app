import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import * as styles from './styles'

//open graph protocol is the tool used to preview links

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [bookmark, setBookmark] = useState('')
  const [bookmarks, setBookmarks] = useState<string[]>([])

  const addBookmark = () => {
    setBookmarks((existingBookmarks) => [...existingBookmarks, bookmark]);
    setBookmark('');
  }
  const removeBookmark = (index: number) => {
    bookmarks.splice(index, index + 1);
    setBookmarks((existingBookmarks) => [...bookmarks]);
}

  const enterInputHandler = (event: any) => {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      addBookmark();
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("keypress", enterInputHandler);
    }
    return () => {
      inputRef.current?.removeEventListener("keypress", enterInputHandler)
    }
  }, [addBookmark])


  console.log(bookmarks)
  return (
    <div className="App">
      <h1>Bookmark App Thing!</h1>

      <label htmlFor='linkInput'>URL:</label>
      <input ref={inputRef} id='linkInput' value={bookmark} onInput={(ev) => {
        setBookmark(ev.currentTarget.value)
      }}></input>
      <button onClick={addBookmark}>Add Bookmark</button>

      {bookmarks.map((bookmark, index) => {
        return (
          <div>
            <p>{bookmark}</p>
            <button onClick={() => {
              removeBookmark(index);
            }}>Delete</button>
          </div>
        )
      })}
    </div>
  );
}

export default App;
