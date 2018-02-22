import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { COLOR } from './../../shared/lb.config';

const Button = ({onPress, children}) => {
    
    const { buttonStyle, textStyle } = styles;

    return (
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
            <Text style={textStyle}>{children}</Text>
        </TouchableOpacity>
    );
};


const styles = {
    textStyle: {
        alignSelf: 'center',
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },
    buttonStyle: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: COLOR.secondary_a,
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5
    }
};

export { Button };