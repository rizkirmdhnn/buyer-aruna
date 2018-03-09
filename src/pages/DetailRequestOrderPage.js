import React, { Component } from 'react';
import { Text, View, FlatList, Image, ScrollView, RefreshControl, AsyncStorage, ToastAndroid } from 'react-native';
import { NavigationActions } from 'react-navigation'
import { CheckBox } from 'react-native-elements';
import moment from 'moment';
import axios from 'axios';
import numeral from 'numeral';
import { BASE_URL, COLOR } from './../shared/lb.config';
import {
  ContainerSection,
  Spinner,
  Button,
  Card
} from './../components/common';

class DetailRequestOrderPage extends Component {
  static navigationOptions = {
    title: 'Detail Permintaan',
    headerRight: <View />
  }

  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      dataMaster: '',
      loading: null,
      idRequest: [],
      idOrder: '',
      tokenUser: '',
      checkedSelected: [],
      checkedNotSelected: [],
      supplierId: '',

      checkedContainer: false,
      unCheckedContainer: false,

      disabledContainer: null,
      NotDisabledContainer: null,
      buttonExpanded: false
    };
  }

  componentWillMount() {
    this.setState({ 
      dataMaster: this.props.navigation.state.params.datas
     });
    AsyncStorage.getItem('loginCredential', (err, result) => {
      if (result) {
        this.setState({
          tokenUser: result,
          idOrder: this.props.navigation.state.params.datas.id
        }, () => {
          return this.getData();
        });
      }
    });
  }

  onRefresh() {
    this.setState({ 
      refreshing: true 
    }, () => {
      this.getData();
    });
  }

  getData() {
    const { idOrder, tokenUser } = this.state;
    axios.get(`${BASE_URL}/buyer/requests/${idOrder}`, {
      headers: {
        token: tokenUser
      }
    }).then(response => {
      res = response.data.data;
      console.log(res, 'ARIP LUKAMAN');
      if (res.Requests.length > 0) {
        this.setState({ buttonExpanded: true });
      }
      this.setState({
        checkedSelected: res.Requests,
        checkedContainer: true,
        refreshing: false
      })
    })
      .catch(error => {
        this.setState({ refreshing: false });
        console.log(error, 'Erroor nya');
        console.log('Error Request Order Get Data');
      })
  }

  viewCheck() {
    this.setState({
      checkedContainer: true,
      unCheckedContainer: false
    });
  }

  viewUnCheck() {
    this.setState({
      checkedContainer: false,
      unCheckedContainer: true
    });
  }

  endRequest = () => {
    console.log(this.state.dataMaster, 'End Request');
    this.setState({ loading: true });
    this.state.checkedSelected.map((item) => this.state.idRequest.push(item.id))

    const dataId = {
      RequestIds: this.state.idRequest
    }
    const idReq = this.state.dataMaster.id;
    console.log(dataId, 'ID PUT');
    axios.put(`${BASE_URL}/buyer/requests/${idReq}`,
      dataId
      , {
        headers: {
          token: this.state.tokenUser,
          'Content-Type': 'application/json',
        }
      }).then(response => {
        res = response.data.data;
        console.log(response, 'RES');
        this.setState({ loading: false });

        const resetAction = NavigationActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'Home' }),
            NavigationActions.navigate({ routeName: 'Transaction' })
          ]
        })
        this.props.navigation.dispatch(resetAction)
      })
      .catch(error => {
        this.setState({ loading: false });
        if (error.response) {
          ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
        }
        else {
          ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
        }
      })
  }

  unCheckItem = data => {
    const { checkedSelected, checkedNotSelected } = this.state;
    if (!checkedNotSelected.includes(data)) {
      this.setState({
        checkedNotSelected: [...checkedNotSelected, data]
      });
    } else {
      this.setState({
        checkedNotSelected: checkedNotSelected.filter(a => a !== data),
        checkedSelected: [...checkedSelected, data]
      });
    }
  };

  checkItem = data => {
    const { checkedSelected, checkedNotSelected } = this.state;
    if (!checkedSelected.includes(data)) {
      this.setState({
        checkedSelected: [...checkedSelected, data]
      });
    } else {
      this.setState({
        checkedSelected: checkedSelected.filter(a => a !== data),
        checkedNotSelected: [...checkedNotSelected, data]
      });
    }
  };


  renderFlatListSupplierUnChecked = () => {
    return (
      <View>
        <FlatList
          data={[this.state.checkedNotSelected]}
          renderItem={({ item }) => this.renderSupplierUnChecked(item)}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }


  renderSupplierChecked = (item) => {
    console.log(item, 'DATA SUPPLIER CHECK');
    if (item.length > 0) {
      console.log('Ada Data');
      return item.map((data, index) => {
        return (
          <View key={index}>
            <Card key={data.id}>
              <View style={styles.itemContainerStyleSupplier}>
                <View style={styles.thumbnailContainerStyle}>
                  <Image
                    style={styles.thumbnailStyle}
                    source={{ uri: `${BASE_URL}/images/${data.Supplier.photo}` }}
                  />
                </View>
                <View style={styles.headerContentStyle}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ flex: 3, fontFamily: 'Muli-Regular', color: COLOR.secondary_a, fontSize: 16 }}>{data.Supplier.name}</Text>
                    <View style={{ flex: 1 }}>
                      <CheckBox
                        containerStyle={{
                          borderWidth: 0,
                          padding: 0,
                          margin: 0,
                          marginTop: 10,
                          width: 25
                        }}
                        onPress={() => this.checkItem(data)}
                        checked={this.state.checkedSelected.includes(data)}
                      />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ flex: 1 }}>{data.Supplier.organization} </Text>
                    <Text style={{ flex: 1 }}>{data.Product.capacity} Kg </Text>
                    <Text style={{ flex: 1 }}>Rp. {data.Product ? numeral(data.Product.minPrice).format('0,0') : '-'} - Rp. {data.Product ? numeral(data.Product.maxPrice).format('0,0') : '-'}</Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        )
      })
    }
    if (item.length === 0) {
      return (
        <View>
          <Text style={{ textAlign: 'center', marginTop: '45%' }}>Belum ada nelayan yang menyanggupi.</Text>
        </View>
      )
    }
  }

  renderSupplierUnChecked = (item) => {
    if (item.length > 0) {
      console.log('Ada Data');
      return item.map((data) => {
        return (
          <Card>
            <View style={styles.itemContainerStyleSupplier}>
              <View style={styles.thumbnailContainerStyle}>
                <Image
                  style={styles.thumbnailStyle}
                  source={{ uri: `${BASE_URL}/images/${data.Supplier.photo}` }}
                />
              </View>
              <View style={styles.headerContentStyle}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ flex: 3, fontFamily: 'Muli-Regular', color: COLOR.secondary_a, fontSize: 16 }}>{data.Supplier.name}</Text>
                  <View style={{ flex: 1 }}>
                    <CheckBox
                      containerStyle={{
                        borderWidth: 0,
                        padding: 0,
                        margin: 0,
                        marginTop: 10,
                        width: 25
                      }}
                      onPress={() => this.unCheckItem(data)}
                      checked={this.state.checkedNotSelected.includes(data)}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ flex: 1 }}>{data.Supplier.organization} </Text>
                  <Text style={{ flex: 1 }}>{data.Product.capacity} Kg </Text>
                  <Text style={{ flex: 1 }}>Rp. {data.Product ? numeral(data.Product.minPrice).format('0,0') : '-'} - Rp. {data.Product ? numeral(data.Product.maxPrice).format('0,0') : '-'}</Text>
                </View>
              </View>
            </View>
          </Card>
        )
      })
    }

    if (item.length === 0) {
      console.log('Tidak Ada Data');
      return (
        <View>
          <Text style={{ textAlign: 'center', marginTop: '45%' }}>Anda belum menolak supplier.</Text>
        </View>
      )
    }
  }


  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />
    }
    if (this.state.dataMaster.Status.id === 19) {
      if (this.state.dataMaster.sanggup > 0) {
        return (
          <View style={{ margin: 10 }}>
            <ContainerSection>
              <Button
                onPress={this.endRequest.bind(this)}
              >
                Lanjut Transaksi
              </Button>
            </ContainerSection>
          </View>
        );
      }
    }
    if (this.state.dataMaster.Status.id === 20) {
      if (this.state.dataMaster.sanggup > 0) {
        return (
          <View style={{ margin: 10 }}>
            <ContainerSection>
              <Button
                onPress={this.endRequest.bind(this)}
              >
                Lanjut Transaksi
              </Button>
            </ContainerSection>
          </View>
        );
      }
      if (this.state.dataMaster.sanggup === 0) {
        return (
          <View style={{ margin: 10 }}>
            <ContainerSection>
              <Button
                onPress={this.endRequest.bind(this)}
              >
                Lanjut Transaksi
             </Button>
            </ContainerSection>
          </View>
        );
      }
    }
  }


  render() {
    const {
      checkedContainer,
      unCheckedContainer,
      buttonExpanded,
      dataMaster
    } = this.state;


    console.log(dataMaster, 'Button');
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        <View style={{ flex: 1, paddingTop: 5 }}>

          <Card>
            <View style={styles.itemContainerStyle}>
              <View style={styles.thumbnailContainerStyle}>
                <Image
                  style={styles.thumbnailStyles}
                  source={{ uri: `${BASE_URL}/images/${dataMaster.photo}` }}
                />
              </View>
              <View style={styles.headerContentStyle}>
                <Text style={styles.headerTextStyle}>{dataMaster.Fish.name}</Text>
                <Text style={styles.headerTextStyle}>{numeral(parseInt(dataMaster.quantity, 0)).format('0,0')} Kg</Text>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 1 }} />
                <View style={{ flex: 1 }} />
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Text>Sampai Tanggal: {moment(dataMaster.dueDate).format('DD/MM/YYYY')}</Text>
                  <Text>Pukul: {moment(dataMaster.dueDate).format('h:mm:ss')}</Text>
                </View>
              </View>
            </View>
          </Card>

          <View style={{ margin: 15, flex: 1, flexDirection: 'row' }}>
            <Button
              onPress={() => this.viewCheck()}
              style={{
                borderRadius: 0,
                backgroundColor: checkedContainer ? COLOR.primary : COLOR.secondary_a
              }}
              textStyle={{ fontSize: 14, fontFamily: 'Muli-Regular' }}
            >
              Supplier Dipilih ({this.state.checkedSelected.length})
            </Button>
            <Button
              onPress={() => this.viewUnCheck()}
              style={{
                borderRadius: 0,
                backgroundColor: unCheckedContainer ? COLOR.primary : COLOR.secondary_a
              }}
              textStyle={{ fontSize: 14, fontFamily: 'Muli-Regular' }}
            >
              Supplier Ditolak ({this.state.checkedNotSelected.length})
            </Button>
          </View>

          <View>

            {
              checkedContainer ?
                <View>
                  <FlatList
                    data={[this.state.checkedSelected]}
                    renderItem={({ item }) => this.renderSupplierChecked(item)}
                    keyExtractor={(item, index) => index}
                  />
                  {
                    buttonExpanded ?
                      <View style={{ flex: 1 }}>
                        {this.renderButton()}
                      </View>
                      :
                      <View />
                  }
                </View>
                :
                <View />
            }


            {
              unCheckedContainer ?
                <View>
                  <FlatList
                    data={[this.state.checkedNotSelected]}
                    renderItem={({ item }) => this.renderSupplierUnChecked(item)}
                    keyExtractor={(item, index) => index}
                  />
                </View>
                :
                <View />
            }

          </View>
        </View>
      </ScrollView>
    );
  }

}

const styles = {
  itemContainerStyle: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  thumbnailStyle: {
    height: 100,
    width: 100,
    borderRadius: 100
  },
  thumbnailStyles: {
    height: 100,
    width: 100,
    resizeMode: 'stretch',
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
    fontWeight: 'bold'
  },
  titleTextStyle: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  itemContainerStyleSupplier: {
    padding: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  loadingStyle: {
    marginTop: 30
  },
  containerScroll: {
    marginTop: 50,
    height: 200,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2
  },
  buttonStyle: {
    backgroundColor: '#006AAF',
    width: 318,
    height: 50,
    margin: 5,
    borderRadius: 5
  },
  buttonStyles: {
    backgroundColor: '#009AD3',
    width: 200,
    height: 50,
    margin: 5,
  },
  buttonStylees: {
    backgroundColor: '#006AAF',
    width: 200,
    height: 50,
    margin: 5,
  },
}

export default DetailRequestOrderPage;
