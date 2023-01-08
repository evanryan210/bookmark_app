import React, { useEffect, useRef, useState } from 'react';
import * as styles from './styles'
//open graph protocol is the tool used to preview links


function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [bookmark, setBookmark] = useState('')
  const [bookmarks, setBookmarks] = useState<{images:{src:string}[],meta:{description:string, title:string,url:string},og:{description:string, image:string},}[]>([])
  const [metaTitle, setMetaTitle] = useState('')
  



  // getData('https://www.w3schools.com/cssref/pr_pos_right.php')
  //   .then((data) =>{
  //       console.log(data)
  //   })
   const runAsync = (runnable: ()=> Promise<void>) =>{
    runnable();
}
//  const getMetaData = (ev: any) =>{
    
  // }


  const addBookmark = () => {
    console.log(typeof bookmarks)
    console.log(bookmarks)
    let regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    let validURL = regex.test(bookmark)

    runAsync(async () => {
      const requestURL = `/metadata?url=https://${bookmark}`
      const response = await fetch(requestURL)
      if (response.ok) {
        console.log('response is ok' + ' ' + requestURL)
        const responseText = await response.json()
        responseText.meta.url = `https://${bookmark}`
        setMetaTitle(responseText.meta.title)
        setBookmarks((existingBookmarks) => [...existingBookmarks, responseText]);
        setBookmark('')
      }
      else {
        console.log('error')
      }
  })

    // if(bookmark === ''){
    //   alert('Please enter a valid url')
    //   return
    // }
    // setBookmarks((existingBookmarks) => [...existingBookmarks, ]);
    // setBookmark('')
    
  }
  const removeBookmark = (index: number) => {
    bookmarks.splice(index, 1);
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


  return (
    <div className="App">
      <div className={styles.mainHeader}>
        <h1>Bookmark App Thing!</h1>
        <div className={styles.urlInputContainer}>
          <label htmlFor='linkInput'>https://</label>
          <input ref={inputRef} id='linkInput' value={bookmark} onInput={(ev) => {
            setBookmark(ev.currentTarget.value)
          }}></input>
        </div>
        <button onClick={addBookmark}>Add Bookmark</button>
      </div>


<div className={styles.bookmarkContainer}>
      {bookmarks.map((bookmark, index) => {
        return (
            <div className={styles.bookmarkItem} onClick={()=>{
              console.log(bookmark)
              window.open(bookmark.meta.url)
            }}>
              <a className={styles.deleteX} onClick={() => {
                removeBookmark(index);
              }}>&#10006;</a>
              {/* <p>{bookmark}</p> */}
              <p>{bookmarks[index].meta.title}</p>
            </div>
        )
      })}
      </div>
</div>
  );
}

export default App;
