import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ToastAndroid, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode'
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL, COLOR } from './../shared/lb.config';
import { Card, ContainerSection, Spinner, Input } from '../components/common';

class MessageAdminPage extends Component {
	static navigationOptions = () => ({
		title: 'Admin Aruna',
		headerRight: <View />
	})

	constructor(props) {
		super(props)
	
		this.state = {
			loading: true,
			data: {},
			text: '',
			decoded: '',
		}
	}

	componentDidMount() {
		AsyncStorage.getItem('loginCredential', (err, result) => {
			const datas = result;
			const deco = jwtDecode(datas);
			this.setState({ decoded: deco });
		});
		this.fetchMessage()
	}

	componentWillUnmount() {
		clearTimeout(this.timer)
	}

	onChangeInput = (name, v) => {
		this.setState({[name]: v})
	}

	fetchMessage = () => {
		console.log('masuk rekursif')
		let token = this.props.user.token

		axios.get(`${BASE_URL}/messages/contact-admin/client?sorting=ASC`, {
			headers: {token}
		})
		.then(response => {
			this.setState({data: response.data.data, loading: false})
		})
		.catch(error => {
			if (error.response) {
				ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
			}
			else {
				ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
			}
			this.setState({loading: false})
		})

		this.timer = setTimeout(() => this.fetchMessage(), 5000)
	}

	postMessage = () => {
		let token = this.props.user.token

		let formData = new FormData()
		formData.append('text', this.state.text)

		axios.post(`${BASE_URL}/messages/contact-admin`, formData, {
			headers: {token}
		})
		.then((result) => {
			console.log(result)
			this.setState({text: ''})
			this.fetchMessage()
		})
		.catch(error => {
			ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);
			// if (error.response) {
			// 	alert(error.response.data.message)
			// }
			// else {
			// 	alert('Koneksi internet bermasalah')
			// }
		})
	}

	render() {
		const { loading, data, text } = this.state
		console.log(data)

		if (loading) {
			return <Spinner size='large' />
		}

		return (
			<View style={styles.container}>

				<View style={{marginTop: 5}}>
					<Card style={{backgroundColor: '#fff', padding: 5, justifyContent: 'center', alignItems: 'center'}}>
						<ContainerSection>
							<Text style={{textAlign: 'center'}}>
								Akun Resmi Admin Aruna
							</Text>
						</ContainerSection>
					</Card>
				</View>

				<ScrollView
					style={styles.body}
					ref={ref => this.scrollView = ref}
					onContentSizeChange={() => {
						this.scrollView.scrollToEnd({animated: true})
					}}
				>
					{
						data !== undefined && data.map(item =>
							<View key={item.id} style={styles.messageContainer}>
								<Text style={{textAlign: item.AdminId === null ? 'right' : 'left', fontSize: 16}}>{item.text}</Text>
								<Text style={{textAlign: item.AdminId === null ? 'right' : 'left', fontSize: 9}}>{moment(item.createdAt).format('DD/MM/YYYY | HH:mm')} WIB</Text>
							</View>
						)
					}
				</ScrollView>

				<View style={styles.send}>
					<ContainerSection>
						<Input
							onChangeText={val => this.onChangeInput('text', val)}
							placeholder="Tulis Pesan..."
							value={text}
							multiline
						/>
						<TouchableOpacity 
							disabled={text === ''} 
							onPress={() => this.postMessage()}
						>
							<View style={{marginLeft: 10}}>
								<Icon size={46} color={text === '' ? '#eaeaea' : COLOR.secondary_a} name="md-send" />
							</View>
						</TouchableOpacity>
					</ContainerSection>
				
				</View>
			</View>
		)
	}
}

const styles = {
	container: {
		justifyContent: 'space-between',
		flex: 1
	},
	body: {
		flex: 1
	},
	send: {
		margin: 10,
		marginLeft: 12,
		marginRight: 12
	},
	messageContainer: {
		padding: 15,
		paddingLeft: 18,
		paddingRight: 18,
	},
}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(MessageAdminPage)

