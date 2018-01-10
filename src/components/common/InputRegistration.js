import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'

class InputRegistration extends Component {
	render() {
		const { label, value, onChangeText, placeholder, secureTextEntry, keyboardType } = this.props
		const { inputStyle, labelStyle, containerStyle } = styles

		return (
			<View style={containerStyle}>
				<Text style={labelStyle}>{label}</Text>
				<TextInput 
					secureTextEntry={secureTextEntry}
					placeholder={placeholder}
					autoCorrect={false}
					value={value}
					onChangeText={onChangeText}
					style={inputStyle}
					keyboardType={keyboardType}
				/>
			</View>
		)
	}
}

const styles = {
	inputStyle: {
		paddingLeft: 5,
		paddingRight: 5,
		paddingBottom: 10,
		fontSize: 16,
		flex: 1,
	},
	labelStyle: {
		fontSize: 16,
		paddingLeft: 5,
		flex: 1,
		color: '#8e8e8e'
	},
	containerStyle: {
		height: 60,
		flex: 1,
	}
}

export { InputRegistration }
