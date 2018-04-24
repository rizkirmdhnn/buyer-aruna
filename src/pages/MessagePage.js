import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, AsyncStorage, ToastAndroid, StatusBar } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
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
						console.log(response);
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

		console.log(decoded.user, 'DECODE TOKEN');
		return (
			<View style={styles.container}>
				<StatusBar
					backgroundColor={COLOR.primary}
					barStyle="light-content"
				/>

				<View style={{ marginTop: 5 }}>
					<Card style={{ backgroundColor: '#fff', padding: 5, justifyContent: 'center', alignItems: 'center' }}>
						<ContainerSection>
							<Text style={{ textAlign: 'center' }}>
								No. PO {this.props.navigation.state.params.idData.Request.codeNumber}
							</Text>
						</ContainerSection>
					</Card>
				</View>

				<ScrollView
					style={styles.body}
					ref={ref => { this.scrollView = ref }}
					onContentSizeChange={() => {
						this.scrollView.scrollToEnd({ animated: true })
					}}
				>
					{
						datas !== undefined && datas.map(item =>
							<View key={item.id} style={styles.messageContainer}>
								<View style={item.BuyerId === this.props.user.data.id ? styles.myCard : styles.card}>
									<Text style={item.BuyerId === this.props.user.data.id ? styles.textMyCard : styles.textCard}>{item.text}</Text>
								</View>
								<View style={item.BuyerId === this.props.user.data.id ? styles.statusMyCard : styles.statusCard}>
									<Text style={{ textAlign: item.BuyerId === this.props.user.data.id ? 'right' : 'left', fontSize: 9 }}>{moment(item.createdAt).format('DD/MM/YYYY | HH:mm')} WIB</Text>
									{
										item.BuyerId === this.props.user.data.id &&
										<View style={{ flexDirection: 'row' }}>
											<Icon size={12} style={{ marginLeft: 5 }} color={item.read ? COLOR.primary : '#65636363'} name="md-checkmark" />
											<Icon size={12} style={{ marginLeft: -5 }} color={item.read ? COLOR.primary : '#65636363'} name="md-checkmark" />
										</View>
									}
								</View>
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
							<View style={{ marginLeft: 10 }}>
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
	card: {
		elevation: 1,
		padding: 15,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: '#eaeaea',
		justifyContent: 'flex-end',
		borderRadius: 25,
		alignSelf: 'flex-start',
		marginBottom: 2
	},
	textCard: {
		textAlign: 'left',
		fontSize: 16
	},
	statusCard: {
		flexDirection: 'row',
		alignSelf: 'flex-start',
	},
	myCard: {
		elevation: 1,
		paddingTop: 10,
		paddingBottom: 10,
		padding: 15,
		backgroundColor: COLOR.secondary_b,
		justifyContent: 'flex-end',
		borderRadius: 25,
		alignSelf: 'flex-end',
		marginBottom: 2
	},
	textMyCard: {
		textAlign: 'left',
		fontSize: 16,
		color: '#fff'
	},
	statusMyCard: {
		flexDirection: 'row',
		alignSelf: 'flex-end',
	}
}


const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(MessagePage)
