import React, { Component } from 'react';
import { View } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import LoginFormPage from './pages/LoginFormPage';
import HomePage from './pages/HomePage';
import { Button, Spinner } from './components/common';
import RequestOrder from './pages/RequestOrder';


class App extends Component {
    state = { loggedIn: null };

    renderContent() {
        switch (this.state.loggedIn) {
            case true:
                return <Button onPress={() => firebase.auth().signOut()}>Log Out</Button>;
            default:
                return <HomePage />;
        }
    }

    render() {
        return (
            <View>
                {this.renderContent()}
            </View>
        );
    };
};


export default App;
