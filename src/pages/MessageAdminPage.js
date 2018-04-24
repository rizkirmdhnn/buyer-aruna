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
			textTemp: '',
			decoded: ''
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
		this.setState({ [name]: v }, () => {
			this.setState({ text: this.state.textTemp })
		})
	}

	fetchMessage = () => {
		console.log('masuk rekursif')
		let token = this.props.user.token

		axios.get(`${BASE_URL}/messages/contact-admin/client?sorting=ASC`, {
			headers: { token }
		})
			.then(response => {
				this.setState({ data: response.data.data, loading: false })
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

		this.timer = setTimeout(() => this.fetchMessage(), 5000)
	}

	postMessage = () => {
		let token = this.props.user.token

		let formData = new FormData()
		formData.append('text', this.state.text)

		axios.post(`${BASE_URL}/messages/contact-admin`, formData, {
			headers: { token }
		})
			.then((result) => {
				console.log(result)
				this.setState({ text: '' })
				this.fetchMessage()
			})
			.catch(error => {
				ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);
			})
	}

	render() {
		const { loading, data, textTemp } = this.state
		console.log(data, 'Data Pesan');

		if (loading) {
			return <Spinner size='large' />
		}

		return (
			<View style={styles.container}>

				<View style={{ marginTop: 5 }}>
					<Card style={{ backgroundColor: '#fff', padding: 5, justifyContent: 'center', alignItems: 'center' }}>
						<ContainerSection>
							<Text style={{ textAlign: 'center' }}>
								Akun Resmi Admin Aruna
							</Text>
						</ContainerSection>
					</Card>
				</View>

				<ScrollView
					style={styles.body}
					ref={ref => this.scrollView = ref}
					onContentSizeChange={() => {
						this.scrollView.scrollToEnd({ animated: true })
					}}
				>
					{
						data !== undefined && data.map(item =>
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
							// <View key={item.id} style={styles.messageContainer}>
							// 	<Text style={{ textAlign: item.AdminId === null ? 'right' : 'left', fontSize: 16 }}>{item.text}</Text>
							// 	<Text style={{ textAlign: item.AdminId === null ? 'right' : 'left', fontSize: 9 }}>{moment(item.createdAt).format('DD/MM/YYYY | HH:mm')} WIB</Text>
							// </View>
						)
					}
				</ScrollView>

				<View style={styles.send}>
					<ContainerSection>
						<Input
							onChangeText={val => this.onChangeInput('textTemp', val)}
							placeholder="Tulis Pesan..."
							value={textTemp}
							multiline
						/>
						<TouchableOpacity
							disabled={textTemp === ''}
							onPress={() => this.setState({ textTemp: '' }, () => { this.postMessage() })}
						>
							<View style={{ marginLeft: 10 }}>
								<Icon size={46} color={textTemp === '' ? '#eaeaea' : COLOR.secondary_a} name="md-send" />
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
	},
}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(MessageAdminPage)

