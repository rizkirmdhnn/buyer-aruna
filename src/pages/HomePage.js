/**
 *  Import Component
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage,
  DrawerLayoutAndroid,
  TouchableNativeFeedback,
  ToastAndroid
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import { NavigationActions } from 'react-navigation';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux'

import { ContainerSection, Spinner, InputSearch } from '../components/common'
import Dashboard from './Dashboard';
import RequestOrderPage from './RequestOrderPage';
import TransactionPage from './TransactionPage';
import { BASE_URL, COLOR } from './../shared/lb.config';
import { setUserToken, unreadNotifFetch } from '../redux/actions'

class HomePage extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      screen: 'Dashboard',
      searchItem: [],
      dataItemSearch: '',
      loading: true,
      menuLoginExpanded: false,
      menuLogoutExpanded: false,
      redirectToNotification: false
    }
  }

  componentWillMount() {
    OneSignal.clearOneSignalNotifications();
    AsyncStorage.getItem('loginCredential', (err, result) => {
      if (result) {
        this.props.setUserToken(result)
        this.props.unreadNotifFetch(result)

        this.setState({ menuLoginExpanded: true, loading: false });
      }
      if (!result) {
        this.setState({ menuLogoutExpanded: true, loading: false });
      }
    })
  }

  onItemSelected = (item) => {
    console.log(item, 'Ikan terpilih');
    this.setState({
      dataItemSearch: item
    })
    this.props.navigation.navigate('Filter', { datas: item });
  }

  isLogout() {
    console.log('Logout Klik');
    AsyncStorage.getItem('loginCredential', (err, result) => {
      AsyncStorage.removeItem('loginCredential', () => {
        OneSignal.deleteTag('userid');
        ToastAndroid.show('Berhasil Logout', ToastAndroid.SHORT)
        console.log('Logout Klik Sukses');
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Home' })
          ]
        })
        this.props.navigation.dispatch(resetAction)
      });
    });
  }

  renderScreen = () => {
    if (this.state.screen === 'RequestOrderPage') {
      return <RequestOrderPage navi={this.props.navigation} />
    }
    if (this.state.screen === 'TransactionPage') {
      return <TransactionPage navi={this.props.navigation} />
    }

    return <Dashboard navi={this.props.navigation} />
  }

  render() {
    const { navigate } = this.props.navigation;
    const {
      searchItem,
      loading,
      screen,
      menuLoginExpanded,
      redirectToNotification
    } = this.state;

    // Redirect ke notification list
    if (this.props.user.unreadNotif > 0 && redirectToNotification === false) {
      this.props.navigation.navigate('NotificationList')
      this.setState({redirectToNotification: true})
    }

    const {
      containerStyle, headerHomeStyle, menuContainerStyle,
      profileImageContainer, profileImage, profileName, coin, point, tabContainer, tabContainerActive, tabText, tabTextActive
    } = styles;

    const menuLogin = [
      {
        label: 'Beranda',
        icon: require('./../assets/images/ic_beranda_white.png'),
        screen: 'Home'
      },
      {
        label: 'Profil',
        icon: require('./../assets/images/ic_profile.png'),
        screen: 'ProfileBuyer'
      },
      {
        label: 'Permintaan (PO)',
        icon: require('./../assets/images/ic_po.png'),
        screen: 'Request'
      },
      {
        label: 'Transaksi',
        icon: require('./../assets/images/ic_transaksi.png'),
        screen: 'Transaction'
      },
      {
        label: 'Diskusi',
        icon: require('./../assets/images/ic_diskusi.png'),
        screen: 'MessageList'
      }
    ]

    const menuLogout = [
      {
        label: 'Masuk/Daftar',
        icon: require('./../assets/images/ic_profile.png'),
        screen: 'isLogin'
      }
    ]


    const menuDrawer = (
      <View style={{ flex: 1, backgroundColor: COLOR.secondary_a }}>
        <View style={{ padding: 30 }}>
          <ContainerSection>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Text style={styles.drawerItemText}>Marketplace Aruna</Text>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => this.refs.drawer.closeDrawer()}>
                  <View>
                    <Icon style={{ color: '#fff', alignSelf: 'flex-end' }} st name="md-arrow-back" size={24} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ContainerSection>
          <View style={{ borderTopWidth: 1, borderColor: '#fff', width: '70%', marginLeft: 5, marginRight: 5, marginBottom: 20, marginTop: 10 }} />
          {
            menuLoginExpanded ?
              menuLogin.map((item, index) =>
                <TouchableOpacity
                  key={index}
                  onPress={() => this.props.navigation.navigate(item.screen)}
                >
                  <View style={{ marginBottom: 20 }}>
                    <ContainerSection>
                      <Image
                        style={styles.menuIcon}
                        source={item.icon}
                      />
                      <Text style={styles.drawerItemText}>{item.label}</Text>
                    </ContainerSection>
                  </View>
                </TouchableOpacity>
              )
              :
              menuLogout.map((item, index) =>
                <TouchableOpacity
                  key={index}
                  onPress={() => this.props.navigation.navigate(item.screen)}
                >
                  <View style={{ marginBottom: 20 }}>
                    <ContainerSection>
                      <Image
                        style={styles.menuIcon}
                        source={item.icon}
                      />
                      <Text style={styles.drawerItemText}>{item.label}</Text>
                    </ContainerSection>
                  </View>
                </TouchableOpacity>
              )
          }
          <View style={{ borderTopWidth: 1, borderColor: '#fff', width: '70%', marginLeft: 5, marginRight: 5, marginBottom: 20, marginTop: 10 }} />
          {
            menuLoginExpanded ?
              <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Help')}>
                  <View style={{ marginBottom: 20 }}>
                    <ContainerSection>
                      <Image
                        style={styles.menuIcon}
                        source={require('./../assets/images/ic_pusatbantuan_white.png')}
                      />
                      <Text style={styles.drawerItemText}>Pusat Bantuan</Text>
                    </ContainerSection>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.isLogout()}
                >
                  <View style={{ marginBottom: 20 }}>
                    <ContainerSection>
                      <Image
                        style={styles.menuIcon}
                        source={require('./../assets/images/ic_keluar_white.png')}
                      />
                      <Text style={styles.drawerItemText}>Keluar</Text>
                    </ContainerSection>
                  </View>
                </TouchableOpacity>
              </View>
              :
              <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Help')}>
                  <View style={{ marginBottom: 20 }}>
                    <ContainerSection>
                      <Image
                        style={styles.menuIcon}
                        source={require('./../assets/images/ic_pusatbantuan_white.png')}
                      />
                      <Text style={styles.drawerItemText}>Pusat Bantuan</Text>
                    </ContainerSection>
                  </View>
                </TouchableOpacity>
              </View>
          }
        </View>
      </View>
    )




    return (
      <View style={styles.container}>
        <DrawerLayoutAndroid
          ref="drawer"
          drawerWidth={300}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => menuDrawer}
        >
          <View style={styles.header}>
            <View style={{ paddingLeft: 15, paddingRight: 15 }}>
              <TouchableOpacity onPress={() => this.refs.drawer.openDrawer()}>
                <Icon size={24} name="md-menu" color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerText}>
              <InputSearch
                // onChangeText={(text) => {
                //   this.querySuggestion(text);
                // }}
                onFocus={() => navigate('FilterBefore')}
                placeholder="Cari Komoditas..."
                icon="ic_search"
              />
            </View>
            {
              this.state.menuLoginExpanded ?
                <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('NotificationList')}>
                    <Image
                      style={{ height: 20, width: 15 }}
                      source={
                        this.props.user.unreadNotif > 0 ?
                          require('../assets/images/ic_notification_on.png')
                        :
                          require('../assets/images/ic_notification.png')
                      } 
                    />
                  </TouchableOpacity>
                </View>
                :
                <View style={{ paddingLeft: 5, paddingRight: 5 }} />
            }
          </View>

          {
            searchItem && searchItem.map(item =>
              <TouchableOpacity
                key={item.id}
                onPress={() => this.onItemSelected(item)}
              >
                <View style={styles.containerItemAutoSelect}>
                  <Text>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )
          }

          <View style={menuContainerStyle}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, borderColor: '#3484d7', borderRightWidth: 0.3 }}>
                <TouchableNativeFeedback onPress={() => this.setState({ screen: 'Dashboard' })}>
                  <View style={screen === 'Dashboard' ? tabContainerActive : tabContainer}>
                    <Text style={screen === 'Dashboard' ? tabTextActive : tabText}>Beranda</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
              <View style={{ flex: 1, borderColor: '#3484d7', borderRightWidth: 0.3 }}>
                <TouchableNativeFeedback onPress={() => this.setState({ screen: 'RequestOrderPage' })}>
                  <View style={screen === 'RequestOrderPage' ? tabContainerActive : tabContainer}>
                    <Text style={screen === 'RequestOrderPage' ? tabTextActive : tabText}>Permintaan</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableNativeFeedback onPress={() => this.setState({ screen: 'TransactionPage' })}>
                  <View style={screen === 'TransactionPage' ? tabContainerActive : tabContainer}>
                    <Text style={screen === 'TransactionPage' ? tabTextActive : tabText}>Transaksi</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
            {
              loading ?
                <View style={{ marginTop: '70%' }}>
                  <Spinner size="large" />
                </View>
                :
                <View style={styles.menuContainerStyle}>
                  {this.renderScreen()}
                </View>
            }

          </View>
        </DrawerLayoutAndroid>
      </View>
    );
  }
};


const styles = {
  thumbnailStyle: {
    alignSelf: 'stretch',
    height: 100,
    width: 100,
    borderWidth: 1,
    resizeMode: 'cover'
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
  },
  itemContainerStyle: {
    borderBottomWidth: 1,
    padding: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
  },
  containerFlatList: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  containerFlatListSupplier: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1
  },
  containerProductCard: {
    flex: 1,
    flexDirection: 'row'
  },
  cardProductCard: {
    flex: 1,
    flexDirection: 'row',
    margin: 10
  },
  containerTextProductCard: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 20
  },
  textCard: {
    flex: 1,
    flexDirection: 'row',
    fontSize: 17,
    fontWeight: 'bold'
  },
  textCardLink: {
    color: '#5D9FE2',
    flex: 1,
    flexDirection: 'row',
    marginRight: 18,
    textAlign: 'right'
  },
  buttonStyle: {
    backgroundColor: '#18A0DF',
    marginTop: 8
  },
  imageStyle: {
    width: 500,
    height: 200
  },
  productCardStyle: {
    width: 93,
    height: 93
  },
  item: {
    width: 116,
    height: 116,
    borderWidth: 1,
    borderColor: 'black',
    margin: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerTextStyle: {
    marginTop: 10,
    fontSize: 15,
    color: 'grey',
  },
  headerTextStyleNumber: {
    marginTop: 10,
    fontSize: 25,
    color: 'black'
  },
  headerNumber: {
    marginTop: 30,
    marginRight: 30,
    marginLeft: 30,
    flexDirection: 'column',
  },
  headerContentStyle: {
    flex: 1,
    marginRight: 15,
    marginTop: 30,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  containerStyle: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLOR.secondary_a,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 20 },
    alignItems: 'center',
    shadowOpacity: 0.2,
    width: '100%',
    elevation: 4
  },
  headerText: {
    flex: 1,
    marginTop: 12,
    marginBottom: 12,
  },
  headerHomeStyle: {
    paddingTop: 20,
    paddingBottom: 10,
    flex: 2,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.secondary_a,
    width: '100%'
  },
  menuContainerStyle: {
    flex: 4
  },
  profileImageContainer: {
    height: 90,
    width: 90,
    alignSelf: 'center',
  },
  profileImage: {
    height: 90,
    width: 90,
    borderRadius: 50,
  },
  profileName: {
    textAlign: 'center',
    marginTop: 5,
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Muli-Bold'
  },
  coin: {
    height: 24,
    width: 24,
    alignSelf: 'center'
  },
  point: {
    marginTop: 1,
    marginLeft: 5,
    fontSize: 15,
  },
  tabContainer: {
    backgroundColor: COLOR.element_a3,
    height: 50,
    justifyContent: 'center'
  },
  tabContainerActive: {
    backgroundColor: COLOR.element_a4,
    height: 50,
    justifyContent: 'center'
  },
  tabText: {
    color: '#67a6e3',
    textAlign: 'center',
    fontSize: 16
  },
  tabTextActive: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  drawerItemText: {
    color: '#fff',
    fontSize: 14
  },
  menuIcon: {
    height: 20,
    width: 20,
    marginRight: 20
  }
}

const mapStateToProps = (state) => {
  const { user } = state

  return { user }
}

export default connect(mapStateToProps, { setUserToken, unreadNotifFetch })(HomePage)
