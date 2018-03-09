import React, { Component } from 'react'
import {
  FlatList,
  View,
  Image,
  Text,
  AsyncStorage,
  ScrollView,
  ToastAndroid
} from 'react-native'
import { NavigationActions } from 'react-navigation'
import axios from 'axios';
import numeral from 'numeral';
import { CheckBox } from 'react-native-elements';
import { BASE_URL, COLOR } from './../shared/lb.config';
import {
  Button,
  ContainerSection,
  Spinner
} from './../components/common';

class RequestFormOrderSecondPage extends Component {

  static navigationOptions = {
    title: 'Pilih Supplier',
    headerRight: <View />
  }

  constructor(props) {
    super(props);
    this.state = {
      datax: [{}],
      dataSupplier: [],
      loading: null,
      loader: null,
      checkedSelected: [],
      idSupplier: [],
      dataFirstSearch: '',
      dataSecondButton: '',
      dataThirdHome: '',

      dataNot: ''
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    console.log(params, 'DATA PARAMMMMMMSSSSSSS');
    this.setState({ datax: this.props.navigation.state.params.datas });

    const dataOne = params.dataFirst.navigation;

    switch (dataOne) {
      case 'SEARCH':
        console.log('SEARCH');
        return this.setState({ dataSupplier: params.dataFirst.supplierData });
      case 'LIST':
        console.log('LIST');
        return this.setState({ dataNot: params.dataFirst.dataFish }, () => {
          this.getDefaultButton();
        });
      default:
        console.log('BUTTON');
        return this.getDefaultButton();
    }
  }

  onPressReqButton() {
    const { checkedSelected } = this.state;

    if (checkedSelected.length === 0) {
      return ToastAndroid.show('Anda Belum Memilih Supplier', ToastAndroid.SHORT);
    }

    return this.onSubmit();
  }


  onSubmit = () => {
    this.setState({ loader: true })

    AsyncStorage.getItem('loginCredential', (err, result) => {
      const dataRequest = new FormData();
      dataRequest.append('FishId', this.state.datax.FishId);
      dataRequest.append('maxBudget', this.state.datax.maxBudget);
      dataRequest.append('dueDate', this.state.datax.datePick);
      dataRequest.append('quantity', this.state.datax.quantity);
      dataRequest.append('size', this.state.datax.size);
      dataRequest.append('describe', this.state.datax.deskripsi);
      dataRequest.append('unit', this.state.datax.unitFish);

      this.state.checkedSelected.map((item, index) => dataRequest.append(`ProductIds[${index}]`, item.id))

      dataRequest.append('photo', {
        uri: this.state.datax.photo.uri,
        type: 'image/jpeg',
        name: 'formrequest.png'
      });

      console.log(this.state.datax, 'Data Request');
      console.log(dataRequest, 'Data Form Append');

      axios.post(`${BASE_URL}/buyer/requests`,
        dataRequest
        , {
          headers: {
            'Content-Type': 'multipart/form-data',
            token: result
          }
        }).then(response => {
          res = response.data.data;
          console.log(response, 'RES');
          this.setState({ loader: false });

          const resetAction = NavigationActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({ routeName: 'Home' }),
              NavigationActions.navigate({ routeName: 'Request' })
            ]
          })
          this.props.navigation.dispatch(resetAction)
        })
        .catch(error => {
          if (error.response) {
            ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
          }
          else {
            ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
          }
          this.setState({ loader: false });
        })
    });
  }

  onChangeInput = (name, v) => {
    this.setState({ [name]: v });
    console.log(v);
  }


  getDefaultButton() {
    this.setState({ loading: true })
    AsyncStorage.getItem('loginCredential', (err, result) => {
      const token = result;
      console.log(token);
      axios.post(`${BASE_URL}/generate-request`, {
        FishId: this.state.datax.FishId === undefined || this.state.datax.FishId === null ? this.state.dataNot.id : this.state.datax.FishId,
        ProvinceId: this.state.datax.provinsiId,
        CityId: this.state.datax.cityId,
        maxPrice: this.state.datax.maxBudget
      }, {
          headers: {
            token,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          res = response.data.data;
          console.log(res, 'RES')
          const resultRes = res;
          console.log(resultRes, 'Result Supplier nya');
          this.setState({ dataSupplier: resultRes, checkedSelected: resultRes, loading: false })
        })
        .catch(error => {
          console.log(error.message, 'Error nya');
          alert('Koneksi internet bermasalah')
        })
    });
  }


  checkItem = data => {
    const { checkedSelected } = this.state;
    if (!checkedSelected.includes(data)) {
      this.setState({
        checkedSelected: [...checkedSelected, data]
      });
    } else {
      this.setState({
        checkedSelected: checkedSelected.filter(a => a !== data)
      });
    }
  };

  renderButton = () => {
    if (this.state.loader) {
      return <Spinner size='large' />
    }
    return (
      <Button
        onPress={
          () => this.onPressReqButton()
        }
      >
        Kirim Permintaan
    </Button>
    )
  }

  renderItem = (item) => {
    console.log(item, 'Render Data Supplier');
    console.log(this.state.checkedSelected, 'Data Check');
    return item.map((data, index) => {
      return (
        <View style={styles.card} key={index}>
          <View style={styles.itemContainerStyle}>
            <View style={styles.thumbnailContainerStyle}>
              <Image
                style={styles.thumbnailStyle}
                source={{ uri: `${BASE_URL}/images/${data.User.photo}` }}
              />
            </View>
            <View style={styles.headerContentStyle}>
              <Text style={styles.hedaerTextStyle}>{data.User.name}</Text>
              <Text style={{ fontSize: 10 }}>{data.User.organizationType} {data.User.organization}</Text>
              <Text style={{ fontSize: 10 }}>Rp {numeral(parseInt(data.minPrice, 0)).format('0,0')} - Rp {numeral(parseInt(data.minPrice, 0)).format('0,0')} /Kg</Text>
            </View>
            <CheckBox
              center
              onPress={() => this.checkItem(data)}
              checked={this.state.checkedSelected.includes(data)}
              containerStyle={{
                borderWidth: 0,
                padding: 0,
                margin: 0,
                marginTop: 10,
                width: 40
              }}
            />
          </View>
        </View>
      )
    })
  }

  render() {
    const { dataSupplier } = this.state;
    if (this.state.loading) {
      return <Spinner size="large" />
    }

    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          <FlatList
            data={[this.state.dataSupplier]}
            renderItem={({ item }) => this.renderItem(item)}
          />

          {
            dataSupplier.length === 0 ?
              <View style={{ margin: 10 }}>
                <Text style={{ textAlign: 'center' }}>Ups... Maaf tidak ada daftar nelayan.</Text>
                <Text style={{ textAlign: 'center' }}>Silahkan coba ganti Nama Ikan / Provinsi / Kota.</Text>
              </View>
              :
              <View style={{ margin: 10 }}>
                <ContainerSection>
                  {this.renderButton()}
                </ContainerSection>
              </View>
          }
        </View>
      </ScrollView>
    );
  }
}


const styles = {
  card: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10
  },
  itemContainerStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  thumbnailStyle: {
    height: 100,
    width: 100,
    borderRadius: 50
  },
  headerContentStyle: {
    flex: 1,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  hedaerTextStyle: {
    fontSize: 20,
    color: COLOR.secondary_a
  }
}

export default RequestFormOrderSecondPage;
