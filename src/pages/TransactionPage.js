import React, { Component } from 'react';
import {
  Text,
  View,
  AsyncStorage,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { Header, SearchBar, Icon } from 'react-native-elements';
import axios from 'axios';
import { BASE_URL } from './../shared/lb.config';
import {
  CardRegistration,
  CardSectionRegistration,
  InputRegistration,
  ContainerSection,
  Container,
  Spinner,
  Button,
  Card
} from './../components/common';
import moment from 'moment';

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
      dataTransaksi: []
    };
  };


  async componentWillMount() {
    try {
      const value = await AsyncStorage.getItem('loginCredential');
      if (value !== null) {
        console.log(value, 'Storage Request');
        this.setState({ tokenUser: value })
        return this.getData();
      }
    } catch (error) {
      console.log(error, 'Error Storage Request');
    }
  }

  getData() {
    console.log('API FIRE!')
    axios.get(`${BASE_URL}/buyer/orders?page=0&pageSize=50&sorting=DESC`, {
      headers: {
        'token': this.state.tokenUser
      }
    }).then(response => {
      const result = response.data.data;
      console.log(response, 'Data Transaksi');
      this.setState({ dataTransaksi: result, loading: false });
    })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error.response, 'Error nya');
        console.log('Error Transation Get Data');
      })
  }

  detailTransaction = (props) => {
    const dataTransaction = props;
    this.props.navi.navigate('DetailTransaction', { datas: dataTransaction })
  }

  refreshRequest() {
    return this.getData();
  }

  renderData = (item) => {
    console.log(item, 'Data Trans');
    if (item.length === 0) {
      return (
        <View style={{ paddingTop: '50%' }}>
          <Text style={{ color: 'grey', paddingLeft: '25%' }}>
            Ups.. Your connection internet to slow!
          </Text>
          <Button onPress={() => this.refreshRequest()}>
            Tap Tap Me Please!
          </Button>
        </View>
      );
    }
    return item.map((item, index) => {
      const dateFormat = moment(item.Request.Transaction.updatedAt).format('DD/MM/YYYY');
      const timeFormat = moment(item.Request.Transaction.updatedAt).format('h:mm:ss');
      return (
        
        <Card>
          <TouchableWithoutFeedback
            key={item.id}
            onPress={() => this.detailTransaction(item)}
          >
            <View style={styles.itemContainerStyle}>
              <View style={styles.thumbnailContainerStyle}>
                <Image
                  style={styles.thumbnailStyle}
                  source={{ uri: `${BASE_URL}/images/${item.Request.Transaction.photo}` }}
                />
              </View>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <View>
                  <Text style={styles.headerTextStyle}>{item.Request.Transaction.Fish.name} - {item.Request.Transaction.quantity} Kg</Text>
                  <Text style={styles.titleTextStyle}>{item.Request.Supplier.name}</Text>
                </View>

                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Image
                    style={styles.trackingImage}
                    source={require('./../assets/image/ts1.png')}
                  />
                  <Image
                    style={styles.trackingImage}
                    source={require('./../assets/image/ts2.png')}
                  />
                  <Image
                    style={styles.trackingImage}
                    source={require('./../assets/image/ts3.png')}
                  />
                  <Image
                    style={styles.trackingImage}
                    source={require('./../assets/image/ts4.png')}
                  />
                  <Image
                    style={styles.trackingImage}
                    source={require('./../assets/image/ts5.png')}
                  />
                </View>
              </View>

              <View>
                <Text>DP Dibayar</Text>
                <Text>{dateFormat}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Card>
      )
    })
  }


  render() {
    if (this.state.loading) {
      return <Spinner size="large" />
    }
    return (
      <ScrollView>
        <View>
          <FlatList
            data={[this.state.dataTransaksi]}
            renderItem={({ item }) => this.renderData(item)}
          />
        </View>
      </ScrollView>
    );
  }
};



const styles = {
  thumbnailStyle: {
    height: 50,
    width: 50,
    borderRadius: 8
  },
  itemContainerStyle: {
    padding: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
  },
  trackingImage: {
    height: 22,
    width: 22,
    borderRadius: 8
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
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold'
  },
  titleTextStyle: {
    fontSize: 13,
    fontWeight: 'bold'
  }
}

export default TransactionPage;