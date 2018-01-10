import React, { Component } from 'react';
import { TextInput, Text, View } from 'react-native';


class Input extends Component {
    render() {
        const { label, value, onChangeText, placeholder, secureTextEntry } = this.props;
        const { inputStyle, labelStyle, containerStyle } = styles;

        return (

            <View style={containerStyle}>
                <Text style={labelStyle}>{label}</Text>
                <TextInput
                    secureTextEntry={secureTextEntry}
                    placeholder={placeholder}
                    autoCorrect={false}
                    style={inputStyle}
                    value={value}
                    onChangeText={onChangeText}
                    style={inputStyle}
                />
            </View>
        );
    }
};

const styles = {
    inputStyle: {
        color: '#000',
        fontSize: 18,
        lineHeight: 23,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 2000,
        flex: 2
    },
    labelStyle: {
        fontSize: 18,
        paddingLeft: 20,
        flex: 1
    },
    containerStyle: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
};

export { Input };