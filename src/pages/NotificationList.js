import React, { Component } from 'react'
import { FlatList, View, Text, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'

import { Spinner, Card } from '../components/common'
import { notificationsFetch } from '../redux/actions'

class NotificationList extends Component {
	static navigationOptions = {
		title: 'Notifikasi',
		headerRight: <View />
	}

	componentWillMount() {
		this.props.notificationsFetch(this.props.user.token, '')
	}

	renderItem = (item) => {
		return (
			<Card>
				<TouchableNativeFeedback>
					<View style={styles.itemContainerStyle}>
						<View style={styles.headerContentStyle}>
							<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
								<Text style={{flex: 1}}>{moment(item.createdAt).format('DD/MM/YYYY - HH:mm')} WIB</Text>
								<View style={{margin: 2, height: 15, width: 15, backgroundColor: item.read ? '#eaeaea' : 'red', borderRadius: 25}} />
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
		if (this.props.notifications.loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View style={{flex: 1}}>
				<FlatList
					data={this.props.notifications.data}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
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

export default connect(mapStateToProps, {notificationsFetch})(NotificationList)
