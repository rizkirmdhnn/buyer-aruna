import React, { Component } from 'react'
import { View, Text, Image, Alert, AsyncStorage, ToastAndroid } from 'react-native'
import axios from 'axios'

import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import { BASE_URL } from './../shared/lb.config';

class ForgotPassword extends Component {
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props)
	
		this.state = {
			email: '',
			loading: false
		}
	}

	onChange = (name, value) => {
		this.setState({ [name]: value })
	}

	onSubmit = () => {
		if (this.state.email === '') {
			alert('Email harus diisi')
		}
		else {
			this.setState({loading: true})
			const data = {
				email: this.state.email
			}

			axios.post(`${BASE_URL}/forgot-password`, data)
			.then(() => {
				AsyncStorage.setItem('email', this.state.email).then(console.log('email tersimpan'))

				this.props.navigation.navigate('ResetPassword')
				Alert.alert('Berhasil', `Silahkan cek email anda ${this.state.email} untuk mendapatkan kode penyetelan ulang password`, [])
				this.setState({loading: false})
			})
			.catch(error => {
				console.log(error.response)
				ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);

				// if (error.response) {
				// 	alert(error.response.data.message)
				// }
				// else {
				// 	alert('Koneksi internet bermasalah')
				// }

				this.setState({loading: false})
			})
		}
	}

	renderButton = () => {
		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<Button onPress={() => this.onSubmit()}>
				Kirim 
			</Button>
		)
	}

	render() {
		const { email } = this.state

		return (
			<View style={{flex: 1, paddingTop: 100, backgroundColor: '#2b76d2'}}>
				<Container>
					<ContainerSection>
						<Image
							style={{width: 35, height: 40, marginLeft: 10}}
							source={require('./../assets/images/password_white.png')} 
						/>
					</ContainerSection>
				</Container>
				<Container>
					<ContainerSection>
						<Text style={{color: '#fff'}}>Kami akan mengirimkan konfirmasi & tautan penyetelan ulang kata sandi anda ke email.</Text>
					</ContainerSection>
				</Container>
				
				<Container>
					<ContainerSection>
						<Text style={{color: '#fff', marginBottom: -15}}>Masukkan email</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Email'
							placeholder='Alamat email Anda'
							onChangeText={val => this.onChange('email', val)}
							value={email}
						/>
					</ContainerSection>

					<ContainerSection>
						{this.renderButton()}
					</ContainerSection>
				</Container>
			</View>
		)
	}
}

export default ForgotPassword

