import { combineReducers } from 'redux'
import user from './UserReducer'
import messages from './MessageReducer'
import notifications from './NotificationReducer'

export default combineReducers({
	user,
	messages,
	notifications
})
