/**
 *  Import Component
 */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';

/**
 *  List Page
 */
import MasterPage from './pages/MasterPage';
import LoginFormPage from './pages/LoginFormPage';
import RequestOrderPage from './pages/RequestOrderPage';
import HomePage from './pages/HomePage';
import TransactionPage from './pages/TransactionPage';
import RequestFormOrderPage from './pages/RequestFormOrderPage';
import ProfileSupplierPage from './pages/ProfileSupplierPage';
/**
 *  List Component
 */
import { HeaderHome } from './components/common';


class App extends React.Component {
    state = { loggedIn: false };

    renderContent() {
        switch (this.state.loggedIn) {
            case false:
                return <LoginFormPage />;
            default:
                return <MainNavigator />;
        }
    }

    render() {
        const MainNavigator = TabNavigator({            
            Home: { screen: HomePage },
            Request: { screen: RequestOrderPage },
            Transaction: {
                screen: StackNavigator({
                    Transaction: { screen: TransactionPage },
                    Login: {
                        screen: LoginFormPage,
                        navigationOptions: {
                            title: 'Login',
                            header: null,
                            tabBarVisible: false
                        },
                    },
                    RequestFormOrder: {
                        screen: RequestFormOrderPage,
                        navigationOptions: {
                            title: 'RequestFormOrder',
                            header: null,
                            tabBarVisible: false
                        },
                    },
                    ProfileSupplier: {
                        screen: ProfileSupplierPage,
                        navigationOptions: {
                            title: 'ProfileSupplier',
                            // header: null,
                            tabBarVisible: false
                        },
                    },
                })
            },
        },
    );

        return (
            <View style={styles.container} >
                {/* <HeaderHome headerText="Home Aruna" /> */}
                <HeaderHome />
                <MainNavigator style={styles.tabNav} />
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
        backgroundColor: 'red'
    }
}

export default App;
