import React, { Component } from 'react';
import { Text, View } from 'react-native';


class RequestOrderPage extends Component {
    
    static navigationOptions = {
        title: 'Request',
        header: () => {
            return {
                right: <Text>Go Back</Text>
            };
        }
    }

    render(){
        return(
            <View>
                <Text> Page Request Order </Text>
            </View>
        );
    }
};

export default RequestOrderPage;