import React, { Component } from 'react'
import { View, Text, FlatList, Image, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'

import { messagesFetch } from '../redux/actions'
import { Spinner, Card } from '../components/common'
import { BASE_URL, COLOR } from '../shared/lb.config'

class MessageListPage extends Component {
	static navigationOptions = {
		title: 'Diskusi',
		headerRight: <View />
	}

	componentWillMount() {
		this.props.messagesFetch(this.props.user.token, '')
	}

	renderItem = (item) => {
		return (
			<Card>
				<TouchableNativeFeedback
					onPress={() => this.props.navigation.navigate('Message', { idData: item })}
				>
					<View style={styles.itemContainerStyle}>
						<View style={styles.thumbnailContainerStyle}>
							<Image
								style={styles.thumbnailStyle}
								source={{ uri: `${BASE_URL}/images/${item.Request.Supplier.photo}` }}
							/>
						</View>

						<View style={styles.headerContentStyle}>
							<Text>No. PO {item.Request.codeNumber}</Text>
							<Text style={{ fontSize: 12 }}>{item.lastUpdatedAt ? moment(item.lastUpdatedAt).format('DD MMM YYYY, HH:mm') : ''}</Text>
							<Text style={styles.hedaerTextStyle}>
								{item.Request.Supplier.organizationType}
								{
									item.Request.Supplier.organization ?
										`\n${item.Request.Supplier.organization}`
										:
										item.Request.Supplier.name
								}
							</Text>
						</View>

						{
							item.unread > 0 &&
							<View style={{ backgroundColor: 'red', borderRadius: 50, marginTop: 5, width: 20, height: 20 }}>
								<Text style={{ color: '#fff', fontFamily: 'Muli-Bold', textAlign: 'center' }}>{item.unread}</Text>
							</View>
						}
					</View>
				</TouchableNativeFeedback>
			</Card>
		)
	}

	render() {
		if (this.props.messages.loading) {
			return (
				<View style={{ flex: 1 }}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View style={{ flex: 1 }}>
				<Card>
					<TouchableNativeFeedback
						onPress={() => this.props.navigation.navigate('MessageAdmin',
							{
								id: 1,
								codeNumber: 'chat admin',
								organizationType: 'Admin Aruna',
							})}
					>
						<View style={styles.itemContainerStyle}>
							<View style={styles.thumbnailContainerStyle}>
								<Image
									style={styles.thumbnailStyle}
									source={require('./../assets/images/ic_launcher.png')}
								/>
							</View>

							<View style={styles.headerContentStyle}>
								<Text style={styles.hedaerTextStyle}>
									Admin Aruna
								</Text>
							</View>
						</View>
					</TouchableNativeFeedback>
				</Card>

				{
					this.props.messages.data.length === 0 ?
						<View style={{ marginTop: '25%' }}>
							<View style={styles.card}>
								<View style={styles.thumbnailContainerStyle}>
									<Image
										style={styles.thumbnailStyle}
										source={require('../assets/images/empty_chat.png')}
									/>
								</View>
								<Text style={{ textAlign: 'center' }}>Tidak ada diskusi</Text>
							</View>
						</View>
						:
						<FlatList
							data={this.props.messages.data}
							renderItem={({ item }) => this.renderItem(item)}
							keyExtractor={(item, index) => index}
						/>
				}
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
		backgroundColor: '#fff'
	},
	thumbnailContainerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
	},
	thumbnailStyle: {
		height: 70,
		width: 70,
		borderRadius: 50
	},
	headerContentStyle: {
		marginRight: 15,
		marginTop: 5,
		marginBottom: 10,
		flexDirection: 'column',
		justifyContent: 'space-around'
	},
	hedaerTextStyle: {
		fontSize: 14,
		color: COLOR.secondary_a
	}
}

const mapStateToProps = state => {
	const { messages, user } = state

	return { messages, user }
}

export default connect(mapStateToProps, { messagesFetch })(MessageListPage)
