import { createStore } from "redux"

  const initialMessageState = {
    newMessage: null,
    hasNewMessage: false,
    newShot: null,
    hasNewShot: false
  }
  
  // Use the initialState as a default value
  function messageReducer(state = initialMessageState, action) {
    switch (action.type) {
        case 'newMessage':
            return {...state, newMessage: action.payload, hasNewMessage: true}
        case 'newShot':
            return {...state, newShot: action.payload, hasNewShot: true}
        case 'viewedMessage':
            return {...state, hasNewMessage: false}
        case 'viewedShot':
            return {...state, hasNewShot: false}
        default:
            return state
    }
  }

  export const messageStore = createStore(messageReducer, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())