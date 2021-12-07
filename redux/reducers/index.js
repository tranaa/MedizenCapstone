import { combineReducers } from 'redux'
import { user } from './user'

//redux reducer
const Reducers = combineReducers({
    userState: user,
})

export default Reducers