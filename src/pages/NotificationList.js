import React, { Component } from 'react'
import { FlatList, View, Text, TouchableNativeFeedback, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'

import { Card } from '../components/common'
import { notificationsFetch, unreadNotifFetch } from '../redux/actions'
import { BASE_URL } from '../shared/lb.config';

class NotificationList extends Component {
	static navigationOptions = {
		title: 'Notifikasi',
		headerRight: <View />
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			refreshing: true
		}
	}

	componentWillMount() {
		this.props.notificationsFetch(this.props.user.token, '', () => {
			console.log('Exit 1')
			this.setState({ refreshing: false })
		});
	}

	componentDidMount() {
		this.props.unreadNotifFetch(this.props.user.token, () => {
			console.log('Exit 2')
			this.setState({ refreshing: false })
		});
	}

	fetchDetail = (type, id) => {
		let token = this.props.user.token
		let newType = type

		if (type === 'messages') {
			newType = 'orders'
		}

		axios.get(`${BASE_URL}/buyer/${newType}/${id}`, {
			headers: { token }
		})
			.then(response => {
				this.setState({ refreshing: false })
				let link = 'DetailRequestOrder'
				let additionalProps = {
					datas: response.data.data
				}

				if (type === 'orders') {
					link = 'DetailTransaction'
				}
				else if (type === 'messages') {
					link = 'Message'
					additionalProps = {
						idData: response.data.data
					}
				}

				this.props.navigation.navigate(link, additionalProps)
			})
			.catch(error => {
				console.log(error)
				if (error.response) {
					ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
				}
				else {
					ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
				}
				this.setState({ refreshing: false })
			})
	}

	renderItem = (item) => {
		return (
			<Card>
				<TouchableNativeFeedback onPress={() => this.fetchDetail(item.type, item.typeId)}>
					<View style={styles.itemContainerStyle}>
						<View style={styles.headerContentStyle}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
								<Text style={{ flex: 1 }}>{moment(item.createdAt).format('DD/MM/YYYY - HH:mm')} WIB</Text>
								<View style={{ margin: 2, height: 15, width: 15, backgroundColor: item.read ? '#eaeaea' : 'red', borderRadius: 25 }} />
							</View>
							<Text style={styles.hedaerTextStyle}>{item.title}</Text>
							<Text>{item.message}</Text>
						</View>
					</View>
				</TouchableNativeFeedback>
			</Card>
		)
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<FlatList
					data={this.props.notifications.data}
					renderItem={({ item }) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
					refreshing={this.props.notifications.loading || this.state.loading}
					onRefresh={() => this.props.notificationsFetch(this.props.user.token)}
				/>
			</View>
		)
	}
}

const styles = {
	itemContainerStyle: {
		borderBottomWidth: 1,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		borderColor: '#ddd',
		padding: 10,
		backgroundColor: '#fff'
	},
	thumbnailContainerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
	},
	thumbnailStyle: {
		height: 100,
		width: 100,
	},
	headerContentStyle: {
		flex: 1,
		marginRight: 15,
		marginTop: 5,
		marginBottom: 10,
		flexDirection: 'column',
		justifyContent: 'space-around',
	},
	hedaerTextStyle: {
		fontSize: 20,
		fontFamily: 'Muli-Bold',
	}
}

const mapStateToProps = state => {
	const { user, notifications } = state
	return { user, notifications }
}

export default connect(mapStateToProps, { notificationsFetch, unreadNotifFetch })(NotificationList)
