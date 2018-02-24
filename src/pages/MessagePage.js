import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, AsyncStorage, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Button } from 'react-native-elements';
import { Card, CardSection, Container, ContainerSection, Spinner, InputChat } from '../components/common';
import { BASE_URL } from './../shared/lb.config';
import jwtDecode from 'jwt-decode'

class MessagePage extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: 'Diskusi',
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

	componentWillUnmount() {
	 clearTimeout(this.timer);
	}

	postMessage = () => {
		console.log(this.state.text, 'ISI PESAN');
		if (this.state.text == '') {
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
		else if (loading === false) {
			console.log(this.state.decoded.user, 'DECODE TOKEN');
			return (
				<View style={styles.container}>

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
						<Container>
							<ContainerSection>
								<InputChat
									placeholder="Tulis pesan di sini"
									multiline
									value={text}
									onChangeText={v => this.onChangeInput('text', v)}
								/>
								<Button
									title='Kirim'
									backgroundColor="blue"
									containerViewStyle={{ marginTop: 15 }}
									buttonStyle={{ padding: 10 }}
									onPress={() => this.postMessage()}
								/>
							</ContainerSection>
						</Container>

					</View>
				</View>
			)
		}
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
		backgroundColor: '#eaeaea',
		height: 80,
	},
	messageContainer: {
		padding: 15,
		borderWidth: 1,
		borderColor: '#eaeaea'
	},
}


export default MessagePage;
