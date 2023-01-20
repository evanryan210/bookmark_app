import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as styles from './styles'
import { gapi } from 'gapi-script';

//open graph protocol is the tool used to preview links


function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [bookmark, setBookmark] = useState('')
  const [bookmarks, setBookmarks] = useState<{images:{src:string}[],meta:{description:string, title:string,url:string},og:{description:string, image:string},}[]>(JSON.parse(localStorage.getItem('storedData') ?? '[]'))
  const [metaTitle, setMetaTitle] = useState('')
  const storedData = localStorage.getItem('storedData') ?? '[]'

  const fileRef = useRef<HTMLInputElement>(null)



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
  
  // const add = () => {
  //   const addAgain = (a:number, b:number) =>{
  //     return a+b;
  //   }
  //   return addAgain
  // }
  // const test = add();
  // const adding = test(4,4)
  //make add a function tht creates a function that adds nums together

  const handleDownload = (storedData: string) => {
    return (() => {
      const link = document.createElement("a");
      const file = new Blob([storedData], { type: 'text/plain' });
      //anchor tag attribute 'href' set to URL of the file
      link.href = URL.createObjectURL(file);
      //download attribute set to 'sample.txt'
      link.download = "bookmarks.txt";
      //clicks the anchor element we just created
      link.click();
      //resets
      URL.revokeObjectURL(link.href);
      // document.removeChild(link)
      link.remove();
    })
  }
  const handleFileUpload = () =>{
    
    function onChange(event: any) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event: any){
        console.log(event.target.result);
        var obj = JSON.parse(event.target.result);
        console.log(obj)
        handleData(obj);
    }
    
    function handleData(obj: any){
      const newBookmarks =  [...bookmarks, obj];
        setBookmarks(newBookmarks);
        setBookmark('')
        let bookmarksJSON = JSON.stringify(newBookmarks)
        addToLocalData(bookmarksJSON);
        console.log(bookmarksJSON)
    }
 
    if(fileRef.current){
      fileRef.current.addEventListener('change', onChange);
    }

};

  return (
    <div className={styles.app}>
      <div className={styles.formsContainer}>
        <form className={styles.mainHeader}>
          <h1 className={styles.title}>Bookmarks &#128214;</h1>
          <div className={styles.urlInputContainer}>
            <label htmlFor='linkInput'>URL:</label>
            <input className={styles.inputBox} ref={inputRef} id='linkInput' value={bookmark} onInput={(ev) => {
              setBookmark(ev.currentTarget.value)
            }} required></input>

            <button className={styles.button} role="button" onClick={(ev: any) => {
              addBookmark();
              ev.preventDefault();
            }}>Add Bookmark</button>
          </div>
        </form>

      </div>



      <div className={styles.bookmarkContainer}>
        <div className={styles.tabs}>
          {/* <div className={styles.tab}><p>Favorites</p></div>
          <div className={styles.tab}><p>All Bookmarks</p></div> */}
          <a href='' download><div className={styles.tab} onClick={handleDownload(storedData)}>Download</div></a>
          <input style={{ alignSelf: 'center' }} id="file" type="file" onInput={handleFileUpload} ref={fileRef} />

          


        </div>

        <div className={styles.bookmarks}>
          {bookmarks.map((bookmark, index) => {
            return (
              <div key={index} style={{ backgroundImage: `url(${handleImage(bookmark)})` }} className={styles.bookmarkItem} onClick={() => {
                console.log(bookmark)
                window.open(bookmark.meta.url)
              }}>
                <a className={styles.deleteX} onClick={(ev: any) => {
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
    </div>
  );
}

export default App;
