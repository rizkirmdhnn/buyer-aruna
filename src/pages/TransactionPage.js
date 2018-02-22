import React, { Component } from 'react';
import {
  Text,
  View,
  AsyncStorage,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
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
import { COLOR } from './../shared/lb.config';

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
        case 5:
          return require('../assets/images/status5f.png')
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
      case 5:
        return require('../assets/images/status5.png')
      default:
        return require('../assets/images/status1.png')
    }
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
              <Text>No. PO {item.id}</Text>
              <Text>{item.Request ? item.Request.Transaction.Fish.name : '-'}</Text>
              <Text>{item.Request ? item.Request.Supplier.name : ''}</Text>
              <Text style={styles.hedaerTextStyle}>{item.StatusHistories && item.StatusHistories.length > 0 ? item.StatusHistories[item.StatusHistories.length - 1].Status.name : 'Kontrak Belum Dibuat'}</Text>
              <View style={{flexDirection: 'row'}}>
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
                <Image 
                  style={styles.statusIcon}
                  source={this.imageIcon(item, 5)}
                />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
      </Card>
    )
  }


  render() {
    if (this.state.loading) {
      return <Spinner size="large" />
    }
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={this.state.dataTransaksi}
          renderItem={({ item }) => this.renderData(item)}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
};



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
  }
}

export default TransactionPage;