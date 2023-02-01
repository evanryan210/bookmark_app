import React, { useEffect, useRef, useState } from 'react';
import * as styles from './styles'
//open graph protocol is the tool used to preview links


function App2() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [bookmarkURL, setBookmarkURL] = useState('')
  const [bookmarks, setBookmarks] = useState<{ images: { src: string }[], meta: { description: string, title: string, url: string }, og: { description: string, image: string }, }[]>(JSON.parse(localStorage.getItem('storedBookmarks') ?? '[]'))
  const [metaTitle, setMetaTitle] = useState('')

  const addBookmark = () => {
    //run async
  (async () => {
    const requestURL = `/metadata?url=https://${bookmarkURL}`
    const response = await fetch(requestURL)
    const responseText = await response.json()
    responseText.url = `https://${bookmarkURL}`
    console.log(responseText)
    const newBookmarks = ([...bookmarks, responseText])
    setBookmarks(newBookmarks)
    setBookmarkURL('')
    let bookmarksJSON = JSON.stringify(newBookmarks)
    console.log(bookmarksJSON)
    addToLocalData(bookmarksJSON)

  })();
}
    
  const handleImage = (bookmark: any) =>{
    
  }
  const removeBookmark = (index: any) =>{

  }
  const addToLocalData = (bookmarksJSON: string) =>{
    localStorage.setItem('storedBookmarks', bookmarksJSON)
  }

  return (
    <div className={styles.app}>
      <div>
        <form className={styles.mainHeader}>
          <h1 className={styles.title}>Bookmarks</h1>
          <div className={styles.urlInputContainer}>
            <label htmlFor='linkInput'>URL:</label>
            <input className={styles.inputBox} ref={inputRef} id='linkInput' value={bookmarkURL} onInput={(ev) => {
              setBookmarkURL(ev.currentTarget.value)
            }} required></input>

            <button className={styles.button} role="button" onClick={(ev: any) => {
              addBookmark();
              ev.preventDefault();
            }}>Add Bookmark</button>
          </div>
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
              <p className={styles.bookmarkTitle}>{bookmarks[index].meta.title}</p>
            </div>
        )
      })}
      </div>
</div>
  );
}
export default App2;
