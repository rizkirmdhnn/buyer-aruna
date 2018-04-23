import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { BASE_URL } from '../../shared/lb.config'
import {
	SUPPLIER_POPULAR_FETCH_SUCCESS
} from './types'

export const homeSupplierFetch = () => async (dispatch) => {
	axios.get(`${BASE_URL}/suppliers/popular`)
	.then(response => {
		dispatch({
			type: SUPPLIER_POPULAR_FETCH_SUCCESS,
			payload: response.data.data
		})
	})
	.catch(error => {
		if (error.response) {
			ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
		}
		else {
			ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
		}
	})
}

