import React from 'react';
import { View } from 'react-native';


const CardSectionRegistration = (props) => {
    return (
        <View style={style.containerStyle}>
            {props.children}
        </View>
    );
};


const style = {
    containerStyle: {
        borderBottomWidth: 1,
        padding: 2,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        position: 'relative'
    }
};


export { CardSectionRegistration };