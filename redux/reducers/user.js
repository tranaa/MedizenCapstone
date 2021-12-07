import { USER_TODOLIST_STATE_CHANGE, USER_MOODS_STATE_CHANGE, USER_STATE_CHANGE, USER_MEDICINES_STATE_CHANGE, CLEAR_DATA } from "../constants"

// user reducer, when action is called the action is triggered and this updates the reduce store with the state
const initialState = {
    currentUser: null,
    medicines: [],
    moods: [],
    toDoList: [],
}

export const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_MEDICINES_STATE_CHANGE:
            return {
                ...state,
                medicines: action.medicines
            }
        case USER_MOODS_STATE_CHANGE:
            return {
                ...state,
                moods: action.moods
            }
        case USER_TODOLIST_STATE_CHANGE:
            return {
                ...state,
                toDoList: action.toDoList
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}