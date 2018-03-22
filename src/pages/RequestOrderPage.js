import React, { Component } from 'react';
import { Text, FlatList, View, Image, TouchableWithoutFeedback, AsyncStorage } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import {
  Card,
  Button
} from './../components/common';
import { BASE_URL } from './../shared/lb.config';

class RequestOrderPage extends Component {

  static navigationOptions = {
    title: 'Permintaan',
    headerRight: <View />
  }


  constructor(props) {
    super(props);
    this.state = {
      tokenUser: '',
      dataReqOrder: [],
      expiredContainer: null,
      NoExpiredContainer: null,
      refresh: true,
      anyData: true,
      noData: null,
      noListData: null
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('loginCredential', (err, result) => {
      if (result) {
        console.log('Storage Tidak Kosong');
        this.setState({ tokenUser: result });
        return this.getData();
      }
      console.log('Storage Kosong');
      this.setState({ noData: true, refresh: false });
      // return this.getNoData();
    })
  }

  getNoData() {
    return (
      <View>
        <View style={styles.thumbnailContainerStyle}>
          <Image
            style={styles.thumbnailStyle}
            source={require('../assets/images/notLogin.png')}
          />
        </View>
        <Text style={{ textAlign: 'center' }}>Maaf... Anda belum login.</Text>
        <Text style={{ textAlign: 'center' }}>Silahkan login terlebih dahulu. </Text>
        <View style={{ padding: 15, height: 80 }}>
          <Button onPress={() => { this.loginFirst() }}>
            Login
            </Button>
        </View>
      </View>
    )
  }

  getData() {
    axios.get(`${BASE_URL}/buyer/requests`, {
      params: {
        sorting: 'DESC'
      },
      headers: {
        token: this.state.tokenUser
      }
    }).then(response => {
      res = response.data.data;
      console.log(res, 'Data Request Order');
      console.log('Fetching Data Done');
      this.setState({
        dataReqOrder: res,
        refresh: false
      }, () => {
        if (res.length === 0) {
          this.setState({ noListData: true });
        }
      });
    })
      .catch(error => {
        this.setState({ refresh: false });
        console.log(error, 'Erroor nya');
        console.log('Error Request Order Get Data');
      })
  }

  loginFirst() {
    this.props.navi.navigate('isLogin');
  }


  handleRefresh = () => {
    console.log('Refresh');
    this.setState({
      refresh: true
    }, () => {
      console.log('Fetch Again');
      this.getData();
    })
  }


  detailOrder = (props) => {
    const listData = props;
    console.log(this.props, 'PROPS');
    if (!this.props.navi) {
      console.log('Bukan Navi')
      this.props.navigation.navigate('DetailRequestOrder', { datas: listData })
    }
    if (this.props.navi) {
      console.log('NAVI');
      this.props.navi.navigate('DetailRequestOrder', { datas: listData })
    }
  }

  orderFirst() {
    this.props.navi.navigate('RequestFormOrderFirst');
  }

  renderData = (item) => {
    console.log(item, 'Tes');
    if (item) {
      if (item.Status.id === 19) {
        if (item.sanggup === 0) {
          return (
            <Card>
              <View style={styles.itemContainerStyle}>
                <View style={styles.thumbnailContainerStyle}>
                  <Image
                    style={styles.thumbnailStyle}
                    source={{ uri: `${BASE_URL}/images/${item.photo}` }}
                  />
                </View>
                <View style={styles.headerContentStyle}>
                  <Text style={styles.headerTextStyle}>{item.Fish.name}</Text>
                  <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={{ fontSize: 13 }}>Batas Waktu: {moment(item.expiredAt).format('DD/MM/YYYY')} Pukul: {moment(item.expiredAt).format('h:mm:ss')} </Text>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>Expired</Text>
                  </View>
                </View>
              </View>
            </Card>
          );
        }

        if (item.sanggup > 0) {
          return (

            <Card>
              <TouchableWithoutFeedback
                onPress={() => this.detailOrder(item)}
                key={item.id}
              >
                <View style={styles.itemContainerStyle}>
                  <View style={styles.thumbnailContainerStyle}>
                    <Image
                      style={styles.thumbnailStyle}
                      source={{ uri: `${BASE_URL}/images/${item.photo}` }}
                    />
                  </View>
                  <View style={styles.headerContentStyle}>
                    <Text style={styles.headerTextStyle}>{item.Fish.name}</Text>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                      <Text style={{ fontSize: 13 }}>Batas Waktu: {moment(item.expiredAt).format('DD/MM/YYYY')} Pukul: {moment(item.expiredAt).format('h:mm:ss')} </Text>
                      <Text>{item.sanggup} Sanggup | {item.tidakSanggup} Menolak | {item.menunggu} Menunggu</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Card>
          );
        }
      }

      if (item.Status.id === 20) {
        return (
          <Card>
            <TouchableWithoutFeedback
              onPress={() => this.detailOrder(item)}
              key={item.id}
            >
              <View style={styles.itemContainerStyle}>
                <View style={styles.thumbnailContainerStyle}>
                  <Image
                    style={styles.thumbnailStyle}
                    source={{ uri: `${BASE_URL}/images/${item.photo}` }}
                  />
                </View>
                <View style={styles.headerContentStyle}>
                  <Text style={styles.headerTextStyle}>{item.Fish.name}</Text>
                  <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={{ fontSize: 13 }}>Batas Waktu: {moment(item.expiredAt).format('DD/MM/YYYY')} Pukul: {moment(item.expiredAt).format('h:mm:ss')} </Text>
                    <Text>{item.sanggup} Sanggup | {item.tidakSanggup} Menolak | {item.menunggu} Menunggu</Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Card>
        );
      }
    }
  }


  render() {
    const { anyData, noData, dataReqOrder, noListData } = this.state;
    console.log(dataReqOrder.length, 'LENGTH BOR')
    return (
      <View style={{ flex: 1 }}>
        {
          anyData ?
            <FlatList
              data={this.state.dataReqOrder}
              renderItem={({ item }) => this.renderData(item)}
              keyExtractor={(item, index) => index}
              refreshing={this.state.refresh}
              onRefresh={() => this.handleRefresh()}
            />
            :
            <View />
        }
        {
          noListData ?
            <View style={{ flex: 1, marginTop: '-60%' }}>
              <View style={styles.thumbnailContainerStyle}>
                <Image
                  style={styles.thumbnailStyle}
                  source={require('../assets/images/empty_transaksi.png')}
                />
              </View>
              <Text style={{ textAlign: 'center' }}>Anda Belum Melakukan Request Order</Text>
              <Text style={{ textAlign: 'center' }}>Silahkan lakukan order komoditas</Text>
              <View style={{ padding: 15, height: 80 }}>
                <Button onPress={() => { this.orderFirst() }}>
                  Buat Permintaan
              </Button>
              </View>
            </View>
            :
            <View />
        }
        {
          noData ?
            <View style={{ flex: 1, marginTop: '-60%' }}>
              {this.getNoData()}
            </View>
            :
            <View />
        }
      </View>
    );
  }
}

const styles = {
  itemContainerStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  thumbnailStyle: {
    // alignSelf: 'stretch',
    height: 100,
    width: 100,
    borderWidth: 1,
    // resizeMode: 'cover'
  },
  headerContentStyle: {
    flex: 1,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  headerTextStyle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  titleTextStyle: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  card: {
    borderRadius: 4,
    // borderColor: '#ddd',
    // borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: 10,
    marginRight: 10,
    // marginTop: 2,
    marginBottom: '2%',
    backgroundColor: '#FFF'
  },
}

export default RequestOrderPage;
