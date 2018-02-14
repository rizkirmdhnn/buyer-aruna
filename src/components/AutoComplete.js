import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'

class AutoComplete extends Component {
	render() {
		const { label, value, onChangeText, placeholder, suggestions, onItemSelected } = this.props
		const { labelStyle, inputStyle, containerStyle, containerSuggestion, containerItem } = styles

		return (
			<View style={containerStyle}>
				<Text style={labelStyle}>{label}</Text>
				<View style={styles.inputContainer}>
					<TextInput
						placeholder={placeholder}
						autoCorrect={false}
						value={value}
						onChangeText={onChangeText}
						style={inputStyle}
						underlineColorAndroid='transparent'
					/>
				</View>
				<View style={containerSuggestion}>
					{this.props.children}
				</View>
			</View>
		)
	}
}

const styles = {
	containerStyle: {
		flex: 1
	},
	inputStyle: {
		paddingLeft: 5,
		paddingRight: 5,
		paddingBottom: 10,
		fontSize: 13,
		flex: 1,
		fontFamily: 'muli',
	},
	containerSuggestion: {
		borderWidth: 1,
		borderRadius: 1,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		borderTopWidth: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
		paddingTop: -10
	},
	labelStyle: {
		fontSize: 16,
		flex: 1,
		color: 'black',
		fontFamily: 'muli'
	},
	inputContainer: {
		flexDirection: 'row',
		borderColor: '#555',
		borderRadius: 3,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	  },
}

export default AutoComplete
