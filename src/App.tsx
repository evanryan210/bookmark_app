import React, { useEffect, useRef, useState } from 'react';
import * as styles from './styles'
//open graph protocol is the tool used to preview links


function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [bookmark, setBookmark] = useState('')
  const [bookmarks, setBookmarks] = useState<{images:{src:string}[],meta:{description:string, title:string,url:string},og:{description:string, image:string},}[]>(JSON.parse(localStorage.getItem('storedData') ?? '[]'))
  const [metaTitle, setMetaTitle] = useState('')
  
  useEffect(()=>{
    if (inputRef.current) {
      inputRef.current.addEventListener("keypress", enterInputHandler);
    }
    return () => {
      inputRef.current?.removeEventListener("keypress", enterInputHandler)
    }
  })
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
    let regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    let validURL = regex.test(bookmark)

    runAsync(async () => {
      console.log(bookmark)
      const requestURL = bookmark.includes('https://') ? `/metadata?url=${bookmark}` : `/metadata?url=https://${bookmark}`
      const response = await fetch(requestURL)
      if (response.ok) {
        console.log('response is ok' + ' ' + requestURL)
        const responseText = await response.json()
        responseText.meta.url = `https://${bookmark}`
        setMetaTitle(responseText.meta.title)
        const newBookmarks =  [...bookmarks, responseText];
        setBookmarks(newBookmarks);
        setBookmark('')
        //setting local storage
        let bookmarksJSON = JSON.stringify(newBookmarks)
        addToLocalData(bookmarksJSON);

      }
      else {
        console.log('error')
      }

  })
    
  }
  const addToLocalData = (data: string) =>{
    localStorage.setItem('storedData', data)
  }

//   const removeBookmark = (index: number) => {

//     const newBookmarks = bookmarks.splice(index, 1);
//     console.log(index)
//     console.log(newBookmarks)
//     setBookmarks((existingBookmarks) => [...bookmarks]);
//     let bookmarksJSON = JSON.stringify(newBookmarks)
//     addToLocalData(bookmarksJSON);
// }
const removeBookmark = (index: number) => {
    
  setBookmarks(bookmarks.splice(index, 1));
  let bookmarksJSON = JSON.stringify(bookmarks)
  addToLocalData(bookmarksJSON);
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

  // useEffect(()=>{
  //   let bookmarksJSON = JSON.stringify(bookmarks)
  //   addToLocalData(bookmarksJSON);
  // },[bookmarks])

  const handleImage = (bookmark: any) => {
    try {
      if (bookmark.images && bookmark.images.length !== 0)  {
        return bookmark.images[0].src
      }
      else {
        return bookmark.og.image
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
      <div className={styles.mainHeader}>
        <h1 className={styles.title}>Bookmark App!</h1>'
        <form>
          <div className={styles.urlInputContainer}>
            <label htmlFor='linkInput'>https://</label>
            <input ref={inputRef} id='linkInput' value={bookmark} onInput={(ev) => {
              setBookmark(ev.currentTarget.value)
            }} required></input>
          </div>
          <button onClick={(ev:any)=>{
            addBookmark();
            ev.preventDefault();}}>Add Bookmark</button>
        </form>
      </div>



<div className={styles.bookmarkContainer}>
      {bookmarks.map((bookmark, index) => {
        return (
            <div key={index} style={{backgroundImage: `url(${handleImage(bookmark)})`}} className={styles.bookmarkItem} onClick={()=>{
              console.log(bookmark)
              window.open(bookmark.meta.url)
            }}>
              <a className={styles.deleteX} onClick={(ev:any) => {
                removeBookmark(index);
                ev.stopPropagation();
              }}>&#10006;</a>
              {/* <p>{bookmark}</p> */}
              <p className={styles.bookMarkTitle}>{bookmarks[index].meta.title}</p>
            </div>
        )
      })}
      </div>
</div>
  );
}

export default App;
