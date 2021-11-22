import { USER_TODOLIST_STATE_CHANGE, USER_MOODS_STATE_CHANGE, USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_MEDICINES_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, CLEAR_DATA } from "../constants"

const initialState = {
    currentUser: null,
    posts: [],
    following: [],
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
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
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