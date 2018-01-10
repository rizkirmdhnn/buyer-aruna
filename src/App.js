/**
 *  Import Component
 */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TabNavigator } from 'react-navigation';


/**
 *  List Page
 */
import MasterPage from './pages/MasterPage';
import LoginFormPage from './pages/LoginFormPage';
import RequestOrderPage from './pages/RequestOrderPage';
import HomePage from './pages/HomePage';
import TransactionPage from './pages/TransactionPage'


class App extends React.Component {
    state = { loggedIn: null };

    renderContent() {
        switch (this.state.loggedIn) {
            case false:
                return <LoginFormPage />;
            default:
                return <MasterPage />;
        }
    }

    render() {
        const MainNavigator = TabNavigator ({
            home: { screen: HomePage },
            request: { screen: RequestOrderPage },
            transaction: { screen: TransactionPage }
        });

        return (
            <View style={styles.container}>
                <MainNavigator />
            </View>
        );
    };
};


const styles = {
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    tabNav: {
        backgroundColor: '#FFF'
    }
}

export default App;
