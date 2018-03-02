/**
 *  Import Component
 */
import React from 'react';
import { StackNavigator } from 'react-navigation';
import numeral from 'numeral';
import OneSignal from 'react-native-onesignal';
import codePush from 'react-native-code-push';
import { setCustomText } from 'react-native-global-props';
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

import reducers from './redux/reducers'
import { COLOR } from './shared/lb.config';

/**
 *  List Page
 */
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
import HelpPage from './pages/HelpPage';
import MessageListPage from './pages/MessageListPage';
import ProfileBuyerPage from './pages/ProfileBuyerPage';
import ProfileBuyerEditPage from './pages/ProfileBuyerEditPage';
import FilterBeforePage from './pages/FilterBeforePage';
import ProductListPage from './pages/ProductListPage';
import DetailFishesPage from './pages/DetailFishesPage';
import NotificationList from './pages/NotificationList';
/**
 *  List Component
 */
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

// font
const customTextProps = { 
  style: { 
    fontFamily: 'Muli-Regular'
  }
}
setCustomText(customTextProps)

class App extends React.Component {
  componentWillMount() {
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentDidMount() {
    OneSignal.configure({});
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    OneSignal.inFocusDisplaying(2);
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onRegistered(notifData) {
    console.log('Device had been registered for push notifications!', notifData);
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
      Help: { screen: HelpPage },
      MessageList: { screen: MessageListPage },
      ProfileBuyer: { screen: ProfileBuyerPage },
      ProfileBuyerEdit: { screen: ProfileBuyerEditPage },
      FilterBefore: { screen: FilterBeforePage },
      ProductList: { screen: ProductListPage },
      DetailFishes: { screen: DetailFishesPage },
      NotificationList: { screen: NotificationList }
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

    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}


App = codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.ON_NEXT_RESUME })(App)

export default App;
