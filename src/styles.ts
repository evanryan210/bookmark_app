import { mergeStyles } from "@fluentui/merge-styles";
import { merge } from "cheerio/lib/static";

export const app = mergeStyles({
    
})
export const mainHeader = mergeStyles({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    padding: '15px'
})
export const formsContainer = mergeStyles({
    display: 'flex',
})
export const title = mergeStyles({
    fontFamily: 'Varela Round, sans-serif',
    fontSize: '50px',
    borderRadius: '15px',
    paddingRight: '100px'
})
export const tabs = mergeStyles({
    display: 'flex',
    fontFamily: 'Varela Round, sans-serif',
    'a':{
        textDecoration: 'none',
    }
})
export const tab = mergeStyles({
    color: 'black',
    cursor: 'pointer',
    outline: '1px solid rgba(0, 0, 0, .5)',
    margin: '5px',
    textAlign: 'center',
    width: '130px',
    height: '20px',
    borderRadius: '20px',
    padding: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
        background: 'rgba(255,255,255,0.5)',
    }
})
export const bookmarkContainer = mergeStyles({
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'stretch',
    flexDirection: 'column'
    
})
export const bookmarks = mergeStyles({
    display: 'flex',
})
export const bookmarkItem = mergeStyles({
    margin: '10px',
    backgroundColor: '#D3D3D3',
    borderRadius: '15px',
    position: 'relative',
    cursor: 'pointer',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition:'center', 
    width: '23%',
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
export const inputBox = mergeStyles({
    height: '20px',
    width: '250px',
    marginLeft: '5px'
})
export const deleteX = mergeStyles({
    right: '10px',
    position: 'absolute',
    cursor: 'pointer',
    color: 'white'
})
export const urlInputContainer = mergeStyles({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
})
export const button = mergeStyles({
  backgroundColor: '#e1ecf4',
  borderRadius: '3px',
  border: '1px solid #7aa7c7',
  boxShadow: 'rgba(255, 255, 255, .7) 0 1px 0 0 inset',
  boxSizing: 'border-box',
  color: '#39739d',
  cursor: 'pointer',
  display: 'inline-block',
  fontFamily: '-apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif',
  fontSize: '13px',
  fontWeight: '400',
  lineHeight: '1.15385',
  margin: '8px',
  outline: 'none',
  padding: '8px',
  position: 'relative',
  textAlign: 'center',
  textDecoration: 'none',
  userSelect: 'none',
//   -webkit-user-select: none;
  touchAction: 'manipulation',
  verticalAlign: 'baseline',
  whiteSpace: 'nowrap',


':hover': {
    backgroundColor: '#b3d3ea',
    color: '#2c5777'
},
':focus': {
  backgroundColor: '#b3d3ea',
  color: '#2c5777',
  boxShadow: '0 0 0 4px rgba(0, 149, 255, .15)',
},
':active': {
  backgroundColor: '#a0c7e4',
  boxShadow: 'none',
  color: '#2c5777',
}
})