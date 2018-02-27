import { combineReducers } from 'redux'
import user from './UserReducer'
import messages from './MessageReducer'

export default combineReducers({
	user,
	messages
})
