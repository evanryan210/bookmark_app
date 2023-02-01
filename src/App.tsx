import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as styles from './styles'
import { gapi } from 'gapi-script';
import useDrivePicker from 'react-google-drive-picker'
import { request } from 'http';
import { parse } from 'path';
import { Icon } from '@iconify/react';



const useScript = (url: string, name: string) => {

  const [lib, setLib] = useState<any>()

  useEffect(() => {
    const script = document.createElement('script')

    script.src = url
    script.async = true
    script.onload = () => setLib(window[name as any])
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [url])

  return lib

}

type Bookmarks = {
  images: { src: string }[], meta: { description: string, title: string, url: string }, og: { description: string, image: string }
}

function App() {

  const inputRef = useRef<HTMLInputElement>(null);
  const storedData = localStorage.getItem('storedData') ?? '[]'
  const parsedStorageData = JSON.parse(storedData)

  const [bookmark, setBookmark] = useState('')
  const [bookmarks, setBookmarks] = useState<Bookmarks[]>(parsedStorageData)
  // const [bookmarks, setBookmarks] = useState<{images: { src: string }[], meta: { description: string, title: string, url: string }, og: { description: string, image: string }, }[]>(JSON.parse(localStorage.getItem('storedData') ?? '[]'))
  const [metaTitle, setMetaTitle] = useState('')
  const [token, setToken] = useState('')

  const gapi = useScript("https://apis.google.com/js/api.js", "gapi")
  const google = useScript("https://accounts.google.com/gsi/client", 'google')
  const fileRef = useRef<HTMLInputElement>(null)
  const [openPicker, authResponse] = useDrivePicker();
  // const customViewsArray = [new google.picker.DocsView()]; // custom view


  let tokenClient: any;
  let pickerInited = false;
  let gisInited = false;

  // Use the API Loader script to load google.picker
  function onApiLoad() {
    gapi.load('picker', onPickerApiLoad);
  }

  function onPickerApiLoad() {
    pickerInited = true;
  }



  // Create and render a Google Picker object for selecting from Drive
  function createPicker() {
    const showPicker = (tokenKey: string) => {
      // TODO(developer): Replace with your API key
      var uploadView = new google.picker.DocsUploadView();
      const picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCS)
        .addView(uploadView)
        .setOAuthToken(tokenKey)
        .setDeveloperKey('AIzaSyAfTOmjGTbcfuOXWw4eIPM3X0V5-p9dHO0')
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
    }
    const handleAuthorization = () => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: '1084495998444-ugc3cg5geenn2o6rku575fjlfe70kca5.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.scripts',
        callback: (response: any) => {
          console.log(response)
          setToken(response.access_token)
          console.log(response.access_token)
          showPicker(response.access_token);
        },
      });
      client.requestAccessToken();
    }
    handleAuthorization();
  }
    // A simple callback implementation.
    function pickerCallback(data: any) {
      let url = 'nothing';
      let doc = data[google.picker.Response.DOCUMENTS][0];
      if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        url = doc[google.picker.Document.URL];
        console.log(doc)
      }
      let fileId = doc.id
      let message = `You picked: ${url}`;
      console.log(message)
      console.log(fileId)
      fileDownloadRequest(fileId, token)
      // document.getElementById('result').innerText = message;
    }

  const fileDownloadRequest = (id: string, token: string) =>{
    runAsync(async () =>{
      const requesturl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`
      const response = await fetch(requesturl, {
        headers: new Headers({
          'Authorization': `Bearer ${token}`, 
      }), 
      })
      if(response.ok){
        // console.log(response)
        const responseBookmarks = await response.json()
        // console.log(JSON.stringify(responseBookmarks))
        const responseString = JSON.stringify(responseBookmarks)
        // console.log(JSON.parse(responseString))
        const existingBookmarks =  [...bookmarks];
        const newBookmarks = existingBookmarks.concat(JSON.parse(responseString))
        // console.log(newBookmarks)
        setBookmarks(newBookmarks);
        setBookmark('')
        let bookmarksJSON = JSON.stringify(newBookmarks)
        addToLocalData(bookmarksJSON)
      }
    
    })
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("keypress", enterInputHandler);
    }
    return () => {
      inputRef.current?.removeEventListener("keypress", enterInputHandler)
    }
  })

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
        responseText.meta.url = `${bookmark}`
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
      console.log(obj)
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
  }

  const uploadFileToDrive = () => {
    runAsync(async () => {
      const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=media", {
        method: 'POST',
        headers: {
          // 'Content-Length': 'aplication/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: `${storedData}`,
      });
  
      response.json().then(data => {
        console.log(data);
      });

    })
  }


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
          <button onClick={createPicker}>Open Picker</button>
          <button onClick={uploadFileToDrive}>Upload to Drive <Icon icon="ic:outline-drive-folder-upload" width='20' /></button>
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
                <p className={styles.bookmarkTitle}>{bookmarks[index].meta.title}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
