import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import { messagesFetch } from '../redux/actions'

class MessageListPage extends Component {
	static navigationOptions = {
			title: 'Diskusi',
			headerRight: <View />
		}

		render() {
			console.log(this.props, 'ini props')
			return (
				<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
					<Text>Coming Soon</Text>
				</View>
			)
		}
}

const mapStateToProps = state => {
	const { messages, user } = state

	return { messages, user }
}

export default connect(mapStateToProps, {messagesFetch})(MessageListPage)
