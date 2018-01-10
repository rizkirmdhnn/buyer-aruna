import React, { Component } from 'react';
import { Text, View } from 'react-native';

class TransactionPage extends Component {
    static navigationOptions = {
        title: 'Transaction',
        header: null
    }
    render() {
        return(
            <View>
                <Text> Transaksi Page </Text>
            </View>
        );
    }
};

export default TransactionPage;