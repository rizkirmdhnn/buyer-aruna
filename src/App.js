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
import RegistrationFormPage from './pages/RegistrationFormPage';
import FormProductRequestPage from './pages/FormProductRequestPage';
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

        const MainScreenNavigator = TabNavigator({
            Home: { screen: HomePage },
            Request: { screen: RequestOrderPage },
            Transaction: { screen: TransactionPage }
        });

        const SimpleApp = StackNavigator({
            Home: { screen: MainScreenNavigator },
            ProfileSupplier: { screen: ProfileSupplierPage },
            FormProductRequest: { screen: FormProductRequestPage},
            RequestFormOrder: { screen: RequestFormOrderPage },
            RegistrationForm: { screen: RegistrationFormPage },
            Login: { screen: LoginFormPage }
        });

        return (
            <View style={styles.container} >
                {/* <HeaderHome /> */}
                <SimpleApp />
                {/* <LoginFormPage /> */}
            </View>
        );
    };
};


const styles = {
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    }
}

export default App;
