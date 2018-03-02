import React, { Component } from 'react';
import { Text, View } from 'react-native'

class Term extends Component {
	static navigationOptions = {
		title: 'Terms & Conditions',
		headerRight: <View />
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Text>
					Coming Soon
				</Text>
			</View>
		)
	}
}

export default Term
