import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { BASE_URL } from '../../shared/lb.config'
import {
	NOTIFICATIONS_FETCH_SUCCESS
} from './types'

export const notificationsFetch = (token, params) => async (dispatch) => {
  const paramEncoded = encodeURI(params)

	axios.get(`${BASE_URL}/notifications?${paramEncoded}`, {
		headers: {token}
	})
	.then(response => {
		dispatch({
			type: NOTIFICATIONS_FETCH_SUCCESS,
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

