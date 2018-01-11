import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { HeaderHome } from './../components/common';

class TransactionPage extends Component {
    static navigationOptions = {
        title: 'Transaction',
        header: null
    }
    render() {
        return(
            <View>
                <HeaderHome />
                <Text> Transaksi Page </Text>
            </View>
        );
    }
};

export default TransactionPage;