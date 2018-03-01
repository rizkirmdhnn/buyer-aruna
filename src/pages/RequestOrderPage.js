import React, { Component } from 'react';
import { Text, FlatList, View, Image, TouchableWithoutFeedback, AsyncStorage, resizeMode, ScrollView } from 'react-native';
import { Header, SearchBar, Icon } from 'react-native-elements';
import { BASE_URL } from './../shared/lb.config';
import axios from 'axios';
import {
  CardRegistration,
  CardSectionRegistration,
  InputRegistration,
  Button,
  ContainerSection,
  Container,
  Spinner,
  Card
} from './../components/common';
import moment from 'moment';

class RequestOrderPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tokenUser: '',
      dataReqOrder: [],
      expiredContainer: null,
      NoExpiredContainer: null,
      refresh: false,
      page: 1,
      seed: 1,
      offset: 4,
      paging: 0,
    };
  }

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
    // const { offset, paging } = this.state;
    axios.get(`${BASE_URL}/buyer/requests`, {
      params: {
        // page: paging,
        // pageSize: offset,
        sorting: 'DESC'
      },
      headers: {
        'token': this.state.tokenUser
      }
    }).then(response => {
      res = response.data.data;
      console.log(res, 'Data Request Order');
      this.setState({
        dataReqOrder: [...this.state.dataReqOrder, ...res],
        loading: false,
        refresh: false
      });
    })
      .catch(error => {
        this.setState({ loading: false, refresh: false });
        console.log(error, 'Erroor nya');
        console.log('Error Request Order Get Data');
      })
  }

  static navigationOptions = {
    title: 'Permintaan',
    headerRight: <View />
  }

  refreshRequest() {
    return this.getData();
  }

  handleRefresh = () => {
    this.setState({
      page: 1,
      refresh: true,
      seed: this.state.seed + 1
    }, () => {
      this.getData();
    })
  }

  handleLoadMore = () => {
    this.setState({
      paging: this.state.paging + 1
    }, () => {
      this.getData();
    });
  }

  renderData = (item) => {
    console.log(item, 'Data ReQ');

    if (item.Status.id == 19) {
      if (item.sanggup == 0) {
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


  render() {
    if (this.state.loading) {
      return <Spinner size="large" />
    }
    return (
      <ScrollView>
        <View>
          <FlatList
            data={this.state.dataReqOrder}
            renderItem={({ item }) => this.renderData(item)}
            keyExtractor={(item, index) => index}
            // refreshing={this.state.refresh}
            // onRefresh={this.handleRefresh}
            // onEndReached={this.handleLoadMore}
            // onEndReachedThreshold={0}
          />
        </View>
      </ScrollView>
    );
  }
};

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
  }
}

export default RequestOrderPage;