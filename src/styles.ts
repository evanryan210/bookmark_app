import { mergeStyles } from "@fluentui/merge-styles";


export const mainHeader = mergeStyles({
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
})
export const title = mergeStyles({
    fontFamily: 'Varela Round, sans-serif',
    borderRadius: '15px'
})
export const bookmarkContainer = mergeStyles({
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
})
export const bookmarkItem = mergeStyles({
    margin: '10px',
    backgroundColor: '#D3D3D3',
    borderRadius: '15px',
    position: 'relative',
    cursor: 'pointer',
    backgroundSize: 'cover',backgroundRepeat: 'no-repeat',backgroundPosition:'center', width: '300px',
    height: '150px',
    transition: 'all .2s ease-in-out',
    ':hover': {
        // width: '310px',
        // height: '160px',
        transform: 'scale(.98)',

    },
    overflow: 'hidden'
})
export const bookMarkTitle = mergeStyles({
    fontFamily: 'Varela Round, sans-serif',
    backgroundColor: 'black',
    color: 'white',
    margin: '0px',
    padding: '4px'
})
export const deleteX = mergeStyles({
    right: '10px',
    position: 'absolute',
    cursor: 'pointer',
    color: 'white'
})
export const urlInputContainer = mergeStyles({
    display: 'flex',
    flexDirection: 'row'
})