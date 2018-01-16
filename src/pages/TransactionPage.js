import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Header, SearchBar, Icon } from 'react-native-elements';


class TransactionPage extends Component {
    static navigationOptions = {
        title: 'Transaction',
        header: (
            <View>
                <Header
                    containerStyle={{ backgroundColor: 'red' }}
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'Home', style: { color: '#EFF6F9' } }}
                    rightComponent={{ icon: 'notifications', color: '#faa51a' }}
                />
                <SearchBar
                    style={{ flex: 1 }}
                    round
                    lightTheme
                    inputStyle={{ color: 'white' }}
                    placeholder='Type Here...' />
            </View>
        )
    }
    render() {
        return (
            <View>
                {/* <HeaderHome /> */}
                <Text> Transaksi Page </Text>
            </View>
        );
    }
};

export default TransactionPage;