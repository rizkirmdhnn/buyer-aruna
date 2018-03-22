/**
 *  Import Component
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  ToastAndroid,
  FlatList,
  AsyncStorage
} from 'react-native';
import numeral from 'numeral';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import { CheckBox } from 'react-native-elements';
import { BASE_URL, COLOR } from './../shared/lb.config';
import { InputSearch } from '../components/common'


class FilterBeforePage extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      tokenUser: '',
      checkedSupplier: [],
      searchItem: '',
      searchItemAll: '',
      dataItemSearch: '',
      viewExpanded: true,
      searchResult: null,
      searchResultAll: null,
      dataParams: '',
      fishData: '',
      idProvince: [],
      refreshing: true,
      refresh: true,
      noListData: null
    }
  }

  componentWillMount() {
    const params = this.props.navigation.state.params;
    this.setState({ dataParams: params });
    console.log(params, 'Data Params');
    if (params) {
      this.updateSelected(params)
    }

    AsyncStorage.getItem('loginCredential', (err, result) => {
      if (result) {
        this.setState({ tokenUser: result });
      }
    })
  }

  onItemSelected = (item) => {
    console.log('On Item Selected');
    console.log(item, 'Ikan terpilih');
    this.setState({ searchResultAll: true, fishData: item, searchResult: false })
    axios.get(`${BASE_URL}/products`, {
      params: {
        key: item.name,
        sorting: 'DESC'
      }
    })
      .then(response => {
        res = response.data.data
        this.setState({ searchItemAll: res, refreshing: false })
        console.log(res, 'Semua Ikan')
      })
      .catch(error => {
        console.log(error, 'Error');
        this.setState({ refreshing: false })
        ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);
      })
  }

  querySuggestion(text) {
    console.log(text, 'Text');
    if (text !== '') {
      console.log('Text Tidak Kosong');
      this.setState({
        searchItem: '',
        checkedSupplier: [],
        searchResult: true,
        searchResultAll: false,
        viewExpanded: false,
        noListData: false
      }, () => {
        axios.get(`${BASE_URL}/fishes?key=${text}&pageSize=5sorting=ASC`)
          .then(response => {
            res = response.data.data
            console.log(res, 'Data Ikan');
            this.setState({ searchItem: res, refresh: false }, () => {
              if (res.length === 0) {
                this.setState({ noListData: true, searchResult: false })
              } else {
                this.setState({ noListData: false, searchResult: true })
              }
            })
          })
          .catch(error => {
            console.log(error, 'Error');
            this.setState({ refresh: false })
            ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);
          })
      });
    } else {
      console.log('Text Kosong');
      this.setState({ viewExpanded: true, searchResult: false, searchResultAll: false });
    }
  }


  updateSelected = (item) => {
    console.log(item, 'Data Params');
    console.log(item.dataProvince, 'Data Provinsi');

    item.dataProvince.map(item2 => this.state.idProvince.push(item2.id))


    const dataProvinceId = {
      ProvinceIds: this.state.idProvince
    }

    this.setState({ searchResultAll: true, searchResult: false, viewExpanded: false })
    axios.get(`${BASE_URL}/products`, {
      params: {
        key: item.fishDatas.datas.name,
        sorting: 'DESC',
        dataProvinceId,
        maxPrice: item.dataPrice
      }
    })
      .then(response => {
        res = response.data.data
        this.setState({ searchItemAll: res, refresh: false })
        console.log(res, 'Semua Ikan Update')
      })
      .catch(error => {
        console.log(error, 'Error');
        this.setState({ refresh: false })
        ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);
      })
  }


  checkItem = data => {
    const { checkedSupplier } = this.state;
    if (!checkedSupplier.includes(data)) {
      this.setState({
        checkedSupplier: [...checkedSupplier, data]
      });
    } else {
      this.setState({
        checkedSupplier: checkedSupplier.filter(a => a !== data)
      });
    }
  };


  handleRefresh = () => {
    console.log('Refresh');
    this.setState({
      refresh: true
    }, () => {
      console.log('Fetch Again');
      this.setState({ refresh: false });
    })
  }


  renderData = (item) => {
    return (
      <View style={styles.card}>
        <View style={styles.itemContainerStyle}>
          <View style={styles.thumbnailContainerStyle}>
            <Image
              style={styles.thumbnailStyle}
              source={{ uri: `${BASE_URL}/images/${item.User.photo}` }}
            />
          </View>
          <View style={styles.headerContentStyle}>
            <Text style={styles.headerTextStyle}>{item.User.name}</Text>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text>{item.Fish.name}</Text>
              <Text>{item.User.organization}</Text>
              <Text>{item.capacity}</Text>
            </View>
            <Text style={{ fontSize: 11 }}>Rp {numeral(parseInt(item.minPrice, 0)).format('0,0')} - Rp {numeral(parseInt(item.maxPrice, 0)).format('0,0')} /Kg</Text>
          </View>
          <View style={{ flex: 1 }}>
            <CheckBox
              containerStyle={{
                borderWidth: 0,
                padding: 0,
                margin: 0,
                marginTop: 10,
                width: 25
              }}
              onPress={() => this.checkItem(item)}
              checked={this.state.checkedSupplier.includes(item)}
            />
          </View>
        </View>
      </View>
    );
  }

  renderDataSearch = (item) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          key={item.id}
          onPress={() => this.onItemSelected(item)}
        >
          <View style={styles.itemContainerStyle}>
            <View style={styles.thumbnailContainerStyle}>
              <Image
                style={styles.thumbnailStyle}
                source={{ uri: `${BASE_URL}/images/${item.photo}` }}
                resizeMode='contain'
              />
            </View>
            <View style={styles.headerContentStyle}>
              <Text style={styles.headerTextStyle}>{item.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }


  render() {
    const {
      searchItem,
      searchItemAll,
      viewExpanded,
      searchResult,
      searchResultAll,
      fishData,
      dataParams,
      checkedSupplier,
      noListData
    } = this.state;

    const { tabContainer, tabText } = styles;

    console.log(checkedSupplier, 'Supplier Check');
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ paddingLeft: 15, paddingRight: 15 }}>
            <TouchableOpacity
              onPress={() => {
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'Home' })
                  ]
                })
                this.props.navigation.dispatch(resetAction)
              }}
            >
              <Icon size={24} name="md-arrow-back" color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerText}>
            <InputSearch
              autoFocus
              onChangeText={(text) => {
                this.querySuggestion(text);
              }}
              placeholder="Cari Komoditas..."
              icon="ic_search"
            />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {
            viewExpanded ?
              <View>
                <View style={{ flex: 1, marginTop: '30%' }}>
                  <Image
                    style={{ alignSelf: 'center' }}
                    source={require('./../assets/images/ga_search.png')}
                  />
                </View>
                <View style={{ marginTop: '40%' }}>
                  <Text style={{ textAlign: 'center', marginTop: '3%' }}>Cari Komoditas Unggulan</Text>
                  <Text style={{ textAlign: 'center', marginTop: '3%' }}>Hanya di Marketplace Aruna</Text>
                </View>
              </View>
              :
              <View />
          }

          {
            searchResult ?
              <View style={{ flex: 1 }}>
                {
                  <FlatList
                    data={searchItem}
                    renderItem={({ item }) => this.renderDataSearch(item)}
                    keyExtractor={(item, index) => index}
                    refreshing={this.state.refresh}
                    onRefresh={() => this.handleRefresh()}
                    keyboardShouldPersistTaps="always"
                  />
                }
              </View>
              :
              <View />
          }

          {
            noListData ?
              <View style={{ marginTop: '30%' }}>
                <View style={{ flex: 1 }}>
                  <Image
                    style={{ alignSelf: 'center' }}
                    source={require('./../assets/images/ga_search.png')}
                  />
                </View>
                <View style={{ marginTop: '40%' }}>
                  <Text style={{ textAlign: 'center', marginTop: '3%' }}>Komoditas tidak ditemukan</Text>
                  <Text style={{ textAlign: 'center', marginTop: '3%' }}>Coba dengan nama Komoditas lain.</Text>
                </View>
              </View>
              :
              <View />
          }

          {
            searchResultAll ?
              <View style={{ flex: 1 }}>
                <View style={{ height: 50 }}>
                  <TouchableNativeFeedback
                    onPress={() => {
                      console.log(fishData, 'Data Ikan Before Filter');
                      this.props.navigation.navigate('Filter', { datas: fishData })
                    }}
                  >
                    <View style={tabContainer}>
                      <Text style={tabText}>Filter</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>

                <View style={{ flex: 1 }}>
                  <FlatList
                    data={searchItemAll}
                    renderItem={({ item }) => this.renderData(item)}
                    keyExtractor={(item, index) => index}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.handleRefresh()}
                    keyboardShouldPersistTaps="always"
                  />
                </View>

                {
                  checkedSupplier.length > 0 ?
                    <View style={{ height: 50 }}>
                      <TouchableNativeFeedback
                        onPress={() => {
                          if (this.state.tokenUser === '') {
                            return ToastAndroid.show('Silahkan login untuk membuat PO', ToastAndroid.SHORT);
                          }
                          const resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate(
                                {
                                  routeName: 'RequestFormOrderFirst',
                                  params:
                                    { dataFish: fishData, navigation: 'SEARCH', dataSearch: dataParams, supplierData: this.state.checkedSupplier, private: false }
                                }
                              )
                            ]
                          })
                          this.props.navigation.dispatch(resetAction)
                        }}
                      >
                        <View style={tabContainer}>
                          <Text style={tabText}>Buat Permintaan Sekarang</Text>
                        </View>
                      </TouchableNativeFeedback>
                    </View>
                    :
                    <View />
                }
              </View>
              :
              <View />
          }
        </View>
      </View>
    );
  }
}


const styles = {
  container: {
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
    marginRight: 15
  },
  itemContainerStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
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
    borderWidth: 1
  },
  headerContentStyle: {
    flex: 1,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 15,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  headerTextStyle: {
    fontSize: 15,
    color: COLOR.secondary_a,
    fontFamily: 'Muli-Bold'
  },
  tabContainerActive: {
    backgroundColor: COLOR.element_a4,
    height: 50,
    justifyContent: 'center'
  },
  tabContainer: {
    backgroundColor: COLOR.element_a3,
    height: 50,
    justifyContent: 'center'
  },
  tabText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16
  },
  tabTextActive: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  card: {
    borderRadius: 4,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: '2%',
    marginBottom: '2%',
    backgroundColor: '#FFF'
  },
}

export default FilterBeforePage;
