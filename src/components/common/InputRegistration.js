import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'

class InputRegistration extends Component {
	render() {
		const { label, value, onChangeText, placeholder, secureTextEntry, keyboardType, editable } = this.props
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
					editable = {editable}
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
		flex: 1
	},
	labelStyle: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 16,
		paddingLeft: 5,
		flex: 1
	},
	containerStyle: {
		height: 60,
		flex: 1,
	}
}

export { InputRegistration }
