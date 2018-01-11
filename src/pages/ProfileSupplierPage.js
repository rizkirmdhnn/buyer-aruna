import React, { Component } from 'react';
import { Text, View } from 'react-native';

class ProfileSupplierPage extends Component {

    static navigationOptions = {
        title: 'Profile Supplier',
        headerStyle: { backgroundColor: '#5D9FE2' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    render() {
        return (
            <View>
                <Text> Profile Supplier Page </Text>
            </View>
        );
    }
};

export default ProfileSupplierPage;