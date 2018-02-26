import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, AsyncStorage, ToastAndroid } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import jwtDecode from 'jwt-decode'

import { Card, ContainerSection, Spinner, Input } from '../components/common';
import { BASE_URL, COLOR } from './../shared/lb.config';

class MessagePage extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: `${navigation.state.params.idData.Request.Supplier.name}`,
		headerRight: <View />
	})

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			datas: {},
			text: '',
			decoded: '',
			tokenUser: ''
		}
	}

	componentDidMount() {
		AsyncStorage.getItem('loginCredential', (err, result) => {
			const datas = result;
			const deco = jwtDecode(datas);
			this.setState({ decoded: deco });
		});
		this.fetchMessage()
		console.log(this.props.navigation.state.params, 'this.props.params')
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	onChangeInput = (name, v) => {
		this.setState({ [name]: v })
	}

	fetchMessage = () => {
		console.log('masuk rekursif')
		const id = this.props.navigation.state.params.idData.id;
		AsyncStorage.getItem('loginCredential', (err, result) => {
			const token = result;
			this.setState({ tokenUser: token });
			axios.get(`${BASE_URL}/orders/${id}/messages`, {
				headers: { token }
			})
			.then(response => {
				console.log(response, 'Data Fetch');
				this.setState({ datas: response.data.data, loading: false })
			})
			.catch(error => {
				if (error.response) {
					ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
				}
				else {
					ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
				}
				this.setState({ loading: false })
			})
		});

		this.timer = setTimeout(() => this.fetchMessage(), 5000)
	}

	postMessage = () => {
		console.log(this.state.text, 'ISI PESAN');
		if (this.state.text === '') {
			alert('Pesan tidak boleh kosong')
		} else {
			AsyncStorage.getItem('loginCredential', (err, result) => {
				const id = this.props.navigation.state.params.idData.id
				const token = result;

				const formData = new FormData()
				formData.append('text', this.state.text)

				axios.post(`${BASE_URL}/orders/${id}/messages`, formData, {
					headers: { token }
				})
					.then(response => {
						this.setState({ text: '' })
						this.fetchMessage()
					})
					.catch(error => {
						console.log(error, 'Error');
						if (error.response) {
							ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
						}
						else {
							ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
						}
					})
			});
		}
	}

	render() {
		const { loading, datas, text, decoded } = this.state;
		console.log(datas, 'Data Chat')

		if (loading === true) {
			return <Spinner size='large' />
		}
		
		console.log(this.state.decoded.user, 'DECODE TOKEN');
		return (
			<View style={styles.container}>

				<View style={{marginTop: 5}}>
					<Card style={{backgroundColor: '#fff', padding: 5, justifyContent: 'center', alignItems: 'center'}}>
						<ContainerSection>
							<Text style={{textAlign: 'center'}}>
								No. PO {this.props.navigation.state.params.idData.id}
							</Text>
						</ContainerSection>
					</Card>
				</View>

				<ScrollView
					style={styles.body}
					ref={ref => this.scrollView = ref}
					onContentSizeChange={(contentWidth, contentHeight) => {
						this.scrollView.scrollToEnd({ animated: true })
					}}
				>
					{
						datas !== undefined && datas.map(item =>
							<View key={item.id} style={styles.messageContainer}>
								<Text style={{ textAlign: item.SupplierId === null ? 'right' : 'left', fontSize: 16 }}>{item.text}</Text>
								<Text style={{ textAlign: item.SupplierId === null ? 'right' : 'left', fontSize: 9 }}>{moment(item.createdAt).format('DD/MM/YYYY | HH:mm')} WIB</Text>
							</View>
						)
					}
				</ScrollView>

				<View style={styles.send}>
					<ContainerSection>
						<Input
							onChangeText={v => this.onChangeInput('text', v)}
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


export default MessagePage;
