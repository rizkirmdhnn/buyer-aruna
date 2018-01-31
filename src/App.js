/**
 *  Import Component
 */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import numeral from 'numeral'

/**
 *  List Page
 */
import MasterPage from './pages/MasterPage';
import LoginFormPage from './pages/LoginFormPage';
import RequestOrderPage from './pages/RequestOrderPage';
import HomePage from './pages/HomePage';
import TransactionPage from './pages/TransactionPage';
import RequestFormOrderFirstPage from './pages/RequestFormOrderFirstPage';
import RequestFormOrderSecondPage from './pages/RequestFormOrderSecondPage';
import ProfileSupplierPage from './pages/ProfileSupplierPage';
import RegistrationFormPage from './pages/RegistrationFormPage';
import FormProductRequestPage from './pages/FormProductRequestPage';
import DetailRequestOrderPage from './pages/DetailRequestOrderPage';
import DetailTransactionPage from './pages/DetailTransactionPage';
import FormContractPage from './pages/FormContractPage';
import FormContractRevisionPage from './pages/FormContractRevisionPage'
/**
 *  List Component
 */
import { HeaderHome } from './components/common';
console.disableYellowBox = true;

numeral.register('locale', 'id', {
    delimiters: {
      thousands: '.',
      decimal: ','
    },
    ordinal: function (number) {
        return number === 1 ? 'er' : 'ème';
    },
    currency: {
        symbol: 'Rp'
    }
  })
  numeral.locale('id')
  

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
        }, {
            tabBarOptions: {
                upperCaseLabel: false,
                activeTintColor: 'white',
                indicatorStyle: {
                    borderBottomColor: '#ffffff',
                    borderBottomWidth: 2,
                  },
                style: {
                    backgroundColor: '#006AAF',
                }
            }
        });

        const SimpleApp = StackNavigator({
            Home: { screen: MainScreenNavigator },
            ProfileSupplier: { screen: ProfileSupplierPage },
            FormProductRequest: { screen: FormProductRequestPage },
            RequestFormOrderFirst: { screen: RequestFormOrderFirstPage },
            RequestFormOrderSecond: { screen: RequestFormOrderSecondPage },
            RegistrationForm: { screen: RegistrationFormPage },
            Login: { screen: LoginFormPage },
            DetailRequestOrder: { screen: DetailRequestOrderPage },
            DetailTransaction: { screen: DetailTransactionPage },
            FormContract: { screen: FormContractPage },
            FormContractRevision: { screen: FormContractRevisionPage }
        }, {
            cardStyle: { backgroundColor: '#FFF' }
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
