import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'

class AutoComplete extends Component {
	render() {
		const { label, value, onChangeText, placeholder, suggestions, onItemSelected } = this.props
		const { labelStyle, inputStyle, containerStyle, containerSuggestion, containerItem } = styles

		return (
			<View style={containerStyle}>
				<Text style={labelStyle}>{label}</Text>
				<TextInput 
					placeholder={placeholder}
					autoCorrect={true}
					value={value}
					onChangeText={onChangeText}
					style={inputStyle}
				/>
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
		fontSize: 16,
		flex: 1,
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
		marginLeft: 4,
		marginRight: 4,
		marginTop: -5
	},
	labelStyle: {
		fontSize: 16,
		paddingLeft: 5,
		flex: 1,
		color: '#8e8e8e'
	},
}

export default AutoComplete
