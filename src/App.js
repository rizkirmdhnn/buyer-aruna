/**
 *  Import Component
 */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TabNavigator, StackNavigator, DrawerNavigator } from 'react-navigation';
import numeral from 'numeral';
import OneSignal from 'react-native-onesignal';
import { COLOR } from './shared/lb.config';


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
import FormContractRevisionPage from './pages/FormContractRevisionPage';
import MessagePage from './pages/MessagePage';
import FilterPage from './pages/FilterPage';
import ListSearchProductPage from './pages/ListSearchProductPage';
import LoginPage from './pages/LoginPage';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Help from './pages/Help';
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
    componentDidMount() {
        OneSignal.configure({});
    }

    componentWillMount() {
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('registered', this.onRegistered);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived(notification) {
        console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
    }

    onRegistered(notifData) {
        console.log("Device had been registered for push notifications!", notifData);
    }

    onIds(device) {
        console.log('Device info: ', device);
    }

    render() {

        const Routes = StackNavigator({
            Home: { screen: HomePage },
            Request: { screen: RequestOrderPage },
            Transaction: { screen: TransactionPage },
            FormProductRequest: { screen: FormProductRequestPage },
            RequestFormOrderFirst: { screen: RequestFormOrderFirstPage },
            RequestFormOrderSecond: { screen: RequestFormOrderSecondPage },
            RegistrationForm: { screen: RegistrationFormPage },
            Login: { screen: LoginFormPage },
            DetailRequestOrder: { screen: DetailRequestOrderPage },
            DetailTransaction: { screen: DetailTransactionPage },
            FormContract: { screen: FormContractPage },
            FormContractRevision: { screen: FormContractRevisionPage },
            Message: { screen: MessagePage },
            ProfileSupplier: { screen: ProfileSupplierPage },
            Filter: { screen: FilterPage },
            ListSearchProduct: { screen: ListSearchProductPage },
            isLogin: { screen: LoginPage },
            ResetPassword: { screen: ResetPassword },
            ForgotPassword: { screen: ForgotPassword },
            Help: { screen: Help }
        }, {
                cardStyle: { backgroundColor: '#fafafa' },
                navigationOptions: {
                    headerTitleStyle: {
                        alignSelf: 'center',
                        color: '#fff',
                        fontFamily: 'Muli-Bold',
                        fontWeight: '300',
                    },
                    headerStyle: {
                        backgroundColor: COLOR.secondary_a,
                    },
                    headerTintColor: '#fff',
                }
            })


        return (
            <View style={styles.container} >
                <Routes />
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
