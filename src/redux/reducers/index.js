import { combineReducers } from 'redux'
import user from './UserReducer'
import messages from './MessageReducer'
import notifications from './NotificationReducer'
import supplierPopular from './SupplierReducer'
import productsPopular from './ProductsReducer'

export default combineReducers({
	user,
	messages,
	notifications,
	supplierPopular,
	productsPopular
})
