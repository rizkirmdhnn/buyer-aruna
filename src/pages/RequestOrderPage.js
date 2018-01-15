import React, { Component } from 'react';
import { Text, View } from 'react-native';
// import { HeaderHome } from './../components/common';

class RequestOrderPage extends Component {
    
    static navigationOptions = {
        header: null
    }

    render(){
        return(
            <View>
                {/* <HeaderHome /> */}
                <Text> Page Request Order </Text>
            </View>
        );
    }
};

export default RequestOrderPage;