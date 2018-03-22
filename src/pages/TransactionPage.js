import React, { Component } from 'react';
import {
  Text,
  View,
  AsyncStorage,
  FlatList,
  Image,
  TouchableNativeFeedback
} from 'react-native';
import axios from 'axios';
import { BASE_URL, COLOR } from './../shared/lb.config';
import {
  Card,
  Button
} from './../components/common';

class TransactionPage extends Component {
  static navigationOptions = {
    title: 'Transaksi',
    headerRight: <View />
  }
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tokenUser: '',
      dataTransaksi: [],
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
      this.setState({ loading: false, noData: true });
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
    console.log('API FIRE!')
    axios.get(`${BASE_URL}/buyer/orders?page=0&pageSize=50&sorting=DESC`, {
      headers: {
        token: this.state.tokenUser
      }
    }).then(response => {
      const result = response.data.data;
      console.log(response, 'Data Transaksi');
      this.setState({ dataTransaksi: result, loading: false }, () => {
        if (result.length === 0) {
          this.setState({ noListData: true });
        }
      });
    })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error.response, 'Error nya');
        console.log('Error Transation Get Data');
      })
  }


  loginFirst() {
    this.props.navi.navigate('isLogin');
  }


  detailTransaction = (props) => {
    const dataTransaction = props;
    if (this.props.navi) {
      this.props.navi.navigate('DetailTransaction', { datas: dataTransaction })
    } else {
      this.props.navigation.navigate('DetailTransaction', { datas: dataTransaction })
    }
  }

  handleRefresh = () => {
    console.log('Refresh');
    this.setState({
      loading: true
    }, () => {
      this.getData();
    })
  }

  imageIcon = (item, index) => {
    if (index <= item.StatusHistories.length) {
      switch (index) {
        case 1:
          return require('../assets/images/status1f.png')
        case 2:
          return require('../assets/images/status2f.png')
        case 3:
          return require('../assets/images/status3f.png')
        case 4:
          return require('../assets/images/status4f.png')
        default:
          return require('../assets/images/status1f.png')
      }
    }

    switch (index) {
      case 1:
        return require('../assets/images/status1.png')
      case 2:
        return require('../assets/images/status2.png')
      case 3:
        return require('../assets/images/status3.png')
      case 4:
        return require('../assets/images/status4.png')
      default:
        return require('../assets/images/status1.png')
    }
  }

  orderFirst() {
    this.props.navi.navigate('RequestFormOrderFirst');
  }

  renderData = (item) => {
    if (item) {
      return (
        <Card>
          <TouchableNativeFeedback
            key={item.id}
            onPress={() => this.detailTransaction(item)}
          >
            <View style={styles.itemContainerStyle}>
              <View style={styles.thumbnailContainerStyle}>
                <Image
                  style={styles.thumbnailStyle}
                  source={{ uri: `${BASE_URL}/images/${item.Request ? item.Request.Transaction.photo : ''}` }}
                />
              </View>
              <View style={styles.headerContentStyle}>
                <Text>No. PO {item.Request.codeNumber}</Text>
                <Text>{item.Request ? item.Request.Transaction.Fish.name : '-'}</Text>
                <Text>{item.Request ? item.Request.Supplier.name : ''}</Text>
                <Text style={styles.hedaerTextStyle}>{item.StatusHistories && item.StatusHistories.length > 0 ? item.StatusHistories[item.StatusHistories.length - 1].Status.name : 'Proses Kontrak'}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    style={styles.statusIcon}
                    source={this.imageIcon(item, 1)}
                  />
                  <Image
                    style={styles.statusIcon}
                    source={this.imageIcon(item, 2)}
                  />
                  <Image
                    style={styles.statusIcon}
                    source={this.imageIcon(item, 3)}
                  />
                  <Image
                    style={styles.statusIcon}
                    source={this.imageIcon(item, 4)}
                  />
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>
        </Card>
      )
    }

    return (
      <View style={{ marginTop: '30%' }}>
        <View style={styles.card}>
          <View style={styles.thumbnailContainerStyle}>
            <Image
              style={styles.thumbnailStyle}
              source={require('../assets/images/empty_transaksi.png')}
            />
          </View>
          <Text style={{ textAlign: 'center' }}>Anda Belum Melakukan Transaksi</Text>
          <Text style={{ textAlign: 'center' }}>Silahkan lakukan order komoditas</Text>
          <View style={{ padding: 15, height: 80 }}>
            <Button onPress={() => { this.orderFirst() }}>
              Buat Permintaan
            </Button>
          </View>
        </View>
      </View>
    );
  }


  render() {
    const { anyData, noData, noListData } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {
          anyData ?
            <FlatList
              data={this.state.dataTransaksi}
              renderItem={({ item }) => this.renderData(item)}
              keyExtractor={(item, index) => index}
              refreshing={this.state.loading}
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
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    backgroundColor: '#fff'
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  thumbnailStyle: {
    height: 100,
    width: 100,
  },
  headerContentStyle: {
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  headerContentStyle2: {
    marginTop: 8,
  },
  hedaerTextStyle: {
    color: COLOR.secondary_a
  },
  statusIcon: {
    height: 25,
    width: 25,
    marginRight: 3
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

export default TransactionPage;
