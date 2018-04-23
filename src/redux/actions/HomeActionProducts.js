import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { BASE_URL } from '../../shared/lb.config'
import {
	PRODUCTS_POPULAR_FETCH_SUCCESS
} from './types'

export const homeProductsFetch = () => async (dispatch) => {
	axios.get(`${BASE_URL}/products/popular`)
	.then(response => {
		dispatch({
			type: PRODUCTS_POPULAR_FETCH_SUCCESS,
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

