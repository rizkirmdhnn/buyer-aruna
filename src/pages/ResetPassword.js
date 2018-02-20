import React, { Component } from 'react'
import { View, Text, Image, Alert, AsyncStorage } from 'react-native'
import axios from 'axios'
import { NavigationActions } from 'react-navigation'

import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import { BASE_URL } from './../shared/lb.config';

class ResetPassword extends Component {
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props)
	
		this.state = {
			token: '',
			email: '',
			password: '',
			confirmPassword: '',
			loading: false
		}
	}

	componentWillMount() {
		AsyncStorage.getItem('email', (err, result) => {
			console.log(result, 'Email')
			if (!result || result === '') {
				const resetAction = NavigationActions.reset({
					index: 0,
					actions: [
						NavigationActions.navigate({ routeName: 'ForgotPassword'})
					]
				})
				this.props.navigation.dispatch(resetAction)
			} 
			else {
				this.setState({email: result})
			}
		})
	}

	onChange = (name, value) => {
		this.setState({ [name]: value })
	}

	onSubmit = () => {
		if (this.state.password === '') {
			alert('Email harus diisi')
		}
		else if (this.state.password !== this.state.confirmPassword) {
			alert('Password dan Ulangi Password tidak cocok')
		}
		else if (this.state.token === '') {
			alert('Kode harus diisi')
		}
		else {
			this.setState({loading: true})
			const data = {
				email: this.state.email,
				password: this.state.password,
				token: this.state.token
			}

			axios.post(`${BASE_URL}/reset-password`, data)
			.then(() => {
				Alert.alert('Berhasil', `Password berhasil disetel ulang. Silahkan coba login dengan password baru`)
				this.setState({loading: false})

				const resetAction = NavigationActions.reset({
					index: 0,
					actions: [
						NavigationActions.navigate({ routeName: 'isLogin'})
					]
				})
				this.props.navigation.dispatch(resetAction)
			})
			.catch(error => {
				console.log(error.response)

				if (error.response) {
					alert(error.response.data.message)
				}
				else {
					alert('Koneksi internet bermasalah')
				}

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
		const { password, confirmPassword, token } = this.state

		return (
			<View style={{flex: 1, paddingTop: 30, backgroundColor: '#2b76d2'}}>
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
						<Text style={{color: '#fff', marginBottom: -15}}>Masukkan password baru</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Password'
							placeholder="Password"
							secureTextEntry
							onChangeText={val => this.onChange('password', val)}
							value={password}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Ulangi Password'
							placeholder="Ulangi Password"
							secureTextEntry
							onChangeText={val => this.onChange('confirmPassword', val)}
							value={confirmPassword}
						/>
					</ContainerSection>

					<ContainerSection>
						<Text style={{color: '#fff', marginBottom: -15, marginTop: 20}}>Masukkan Kode yang dikirim ke email</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Kode dari Email'
							placeholder="Kode dari Email"
							onChangeText={val => this.onChange('token', val)}
							value={token}
						/>
					</ContainerSection>

					<View style={{marginTop: 20, marginBottom: 20}}>
						<ContainerSection>
							{this.renderButton()}
						</ContainerSection>
					</View>
				</Container>
			</View>
		)
	}
}

export default ResetPassword

