import { createStore } from "redux"

  const initialExerciseState = {
    exerciseList: [],
    pageNum: -1
  }
  
  function exerciseReducer(state = initialExerciseState, action) {
    switch (action.type) {
        case 'fetchedExercises':
            return {...state, exerciseList: action.payload, pageNum: 20}
        case 'removeExercises':
            return {...state, exerciseList: [], pageNum: -1}
        case 'nextPage':
            return {...state, pageNum: state.pageNum+20}
        default:
            return state
    }
  }

  export const exerciseStore = createStore(exerciseReducer, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())