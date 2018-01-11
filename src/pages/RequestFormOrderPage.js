import React, { Component } from 'react';
import { Text, View } from 'react-native';

class RequestFormOrderPage extends Component {
    
    static navigationOptions = {
        title: 'Request Form',
        headerStyle: { backgroundColor: '#5D9FE2' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    render() {
        return (
            <View>
                <Text> Request Form Order </Text>
            </View>
        );
    }
};

export default RequestFormOrderPage;