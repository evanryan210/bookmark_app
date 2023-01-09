import { mergeStyles } from "@fluentui/merge-styles";


export const mainHeader = mergeStyles({
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
})
export const title = mergeStyles({
    backgroundImage: 'linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red)',
    webkitBacgroundKit: 'text',
    webkitTextFillColor: 'transparent',
    color: 'white'
})
export const bookmarkContainer = mergeStyles({
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
})
export const bookmarkItem = mergeStyles({
    padding: '10px',
    margin: '10px',
    backgroundColor: '#D3D3D3',
    borderRadius: '15px',
    position: 'relative',
})
export const deleteX = mergeStyles({
    right: '10px',
    position: 'absolute',
    cursor: 'pointer',
})
export const urlInputContainer = mergeStyles({
    display: 'flex',
    flexDirection: 'row'
})