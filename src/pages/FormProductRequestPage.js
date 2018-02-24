import React, { Component } from 'react';
import { Text, View } from 'react-native';

class FormProductRequestPage extends Component {

    static navigationOptions = {
        title: 'Form Product Request',
        headerStyle: { backgroundColor: '#5D9FE2' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    render() {
        return (
            <View>
                <Text> Form Product Request Page </Text>
            </View>
        );
    }
};

export default FormProductRequestPage;