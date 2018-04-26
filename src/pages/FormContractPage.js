import React, { Component } from 'react';
import numeral from 'numeral';
import { NavigationActions } from 'react-navigation';
import {
  View,
  ScrollView,
  Text,
  Alert,
  PixelRatio,
  AsyncStorage,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ToastAndroid,
  Keyboard,
  Picker,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
// import { CheckBox } from 'react-native-elements'
import CheckBox from 'react-native-check-box'
import Icon from 'react-native-vector-icons/Ionicons'
import AutoComplete from '../components/AutoComplete';

import {
  Input,
  Button,
  ContainerSection,
  Container,
  Spinner,
  InputDate
} from './../components/common';
import { BASE_URL, COLOR } from './../shared/lb.config';

class FormContractPage extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Buat Kontrak',
    headerLeft:
      <TouchableNativeFeedback
        onPress={() => {
          Alert.alert(
            '',
            'Batal Mengisi Kontrak?',
            [
              { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              {
                text: 'Ya',
                onPress: () => {
                  navigation.goBack()
                }
              },
            ]
          )
        }}
      >
        <Icon style={{ marginLeft: 20, color: '#fff' }} name="md-arrow-back" size={24} />
      </TouchableNativeFeedback>,
    headerRight: <View />
  });

  constructor(props) {
    super(props);
    this.state = {
      tanggalPenggiriman: false,
      tanggalDP: false,
      loading: null,
      photo: null,
      dataMaster: '',
      dateNowPickPengiriman: '',
      dateNowPickDP: '',

      fishDescribe: '',
      size: '',
      quantity: '',
      price: '',
      name: '',
      idNumber: '',
      organization: '',
      location: '',
      shippingMethod: '',
      locationOfreception: [],
      dateOfReception: '',
      dpAmount: '',
      dpDate: '',
      fishReject: '',
      maxFishReject: '',
      locationEdit: true,
      shareLoc: '',
      hargaTot: 0,
      unitFish: '',
      dataMapCity: '',
      cityId: '',
      suggestions: [],
      value: '',
      isDisabled: true
    }
  }

  componentWillMount() {
    const b = this.props.navigation.state.params.datas.Request.Transaction.quantity;
    const totLah = parseInt(this.state.hargaTot, 0) * parseInt(b, 0);

    this.setState({
      dataMaster: this.props.navigation.state.params.datas,
      quantity: this.props.navigation.state.params.datas.Request.Transaction.quantity.toString(),
      size: this.props.navigation.state.params.datas.Request.Transaction.size,
      fishDescribe: this.props.navigation.state.params.datas.Request.Transaction.describe,
      hargaTot: totLah
    });
  }

  onChangeInput = (name, v) => {
    this.setState({ [name]: v }, () => {
      console.log('Panggil Sum');
      this.sum();
    });
  }


  onContract() {
    console.log(this.state, 'State');
    const {
      size,
      quantity,
      fishDescribe,
      price,
      locationOfreception,
      dpAmount,
      dateNowPickDP,
      dateNowPickPengiriman,
      fishReject,
      maxFishReject,
      cityId
    } = this.state;

    switch (size) {
      case '':
        return ToastAndroid.show('Ukuran Tidak Boleh Kosong', ToastAndroid.SHORT);
      default:
        console.log('Ukuran Tidak Kosong');
        switch (quantity) {
          case '':
            return ToastAndroid.show('Jumlah Tidak Boleh Kosong', ToastAndroid.SHORT);
          default:
            console.log('Ukuran Tidak Kosong');
            switch (fishDescribe) {
              case '':
                return ToastAndroid.show('Deskripsi Komoditas Tidak Boleh Kosong', ToastAndroid.SHORT);
              default:
                console.log('Deskripsi Komoditas Tidak Kosong');
                if (fishDescribe.length <= 3) {
                  return ToastAndroid.show('Deskripsi Komoditas Minimal 4 Huruf', ToastAndroid.SHORT)
                }
                switch (price) {
                  case '':
                    return ToastAndroid.show('Harga Tidak Boleh Kosong', ToastAndroid.SHORT)
                  default:
                    console.log('Harga Tidak Kosong');
                    switch (locationOfreception) {
                      case '':
                        return ToastAndroid.show('Lokasi Penerimaan Tidak Boleh Kosong', ToastAndroid.SHORT)
                      default:
                        console.log('Lokasi Penerimaan Tidak Kosong');
                        if (locationOfreception.length === 0) {
                          return ToastAndroid.show('Lokasi Penerimaan Tidak Boleh Kosong', ToastAndroid.SHORT)
                        }
                        switch (dpAmount) {
                          case '':
                            return ToastAndroid.show('Nominal DP Tidak Boleh Kosong', ToastAndroid.SHORT)
                          default:
                            console.log('Nominal DP Tidak Kosong');
                            switch (dateNowPickDP) {
                              case '':
                                return ToastAndroid.show('Tanggal DP Tidak Boleh Kosong', ToastAndroid.SHORT)
                              default:
                                console.log('Tanggal DP Tidak Kosong');
                                switch (dateNowPickPengiriman) {
                                  case '':
                                    return ToastAndroid.show('Tanggal Penerimaan Tidak Boleh Kosong', ToastAndroid.SHORT)
                                  default:
                                    console.log('Tanggal Penerimaan Tidak Kosong');
                                    switch (fishReject) {
                                      case '':
                                        return ToastAndroid.show('Deskripsi Komoditas Reject Tidak Boleh Kosong', ToastAndroid.SHORT)
                                      default:
                                        console.log('Deskripsi Komoditas Reject Tidak Kosong');
                                        if (fishReject.length <= 3) {
                                          return ToastAndroid.show('Deskripsi Komoditas Reject Minimal 4 Huruf', ToastAndroid.SHORT)
                                        }
                                        switch (maxFishReject) {
                                          case '':
                                            return ToastAndroid.show('Presentase Maksimal Kodomitas Tidak Boleh Kosong', ToastAndroid.SHORT)
                                          default:
                                            console.log('Presentase Komoditas Reject Tidak Kosong');
                                            switch (cityId) {
                                              case '':
                                                return ToastAndroid.show('Kota Tidak Boleh Kosong', ToastAndroid.SHORT)
                                              default:
                                                return this.onSubmit();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  }

  onSubmit = () => {
    console.log(this.state, 'STATE');
    Keyboard.dismiss()
    const dataContract = {
      fishDescribe: this.state.fishDescribe,
      size: this.state.dataMaster.Request.Transaction.size,
      quantity: this.state.quantity,
      price: this.state.price,
      name: this.state.dataMaster.Request.Supplier.name,
      idNumber: this.state.dataMaster.Request.Supplier.idNumber,
      organization: this.state.dataMaster.Request.Supplier.organization,
      location: this.state.dataMaster.Request.Supplier.City.name,
      shippingMethod: 'JNE',
      locationOfreception: this.state.locationOfreception.toString(),
      dateOfReception: this.state.dateOfReception,
      dpAmount: this.state.dpAmount,
      dpDate: this.state.dpDate,
      fishReject: this.state.fishReject,
      maxFishReject: this.state.maxFishReject,
      totalPrice: this.state.hargaTot,
      BuyerCityId: this.state.cityId,
      SupplierCityId: this.state.dataMaster.Request.Supplier.City.id
    }

    const idTransaction = this.state.dataMaster.id;
    this.setState({ loading: true });

    AsyncStorage.getItem('loginCredential', (err, result) => {
      console.log(dataContract, 'Data Contrak');
      console.log(idTransaction, 'ID Transaction');
      axios.post(`${BASE_URL}/buyer/orders/${idTransaction}/contracts`,
        dataContract
        , {
          headers: {
            token: result,
            'Content-Type': 'application/json',
          }
        }).then(response => {
          res = response.data.data;
          console.log(response, 'RES');

          Alert.alert(
            '',
            'Data kontrak berhasil disimpan. Silahkan tunggu jawaban dari Nelayan',
            [
              { text: 'Ok', onPress: () => this.navigationRedirect() },
            ]
          )
          this.setState({ loading: false })
        })
        .catch(error => {
          console.log(error.response.data.message, 'Error Kontrak');
          if (error.response) {
            ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
          }
          else {
            ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
          }
        })
    })
  }

  onItemSelected = (item) => {
    console.log(item, 'Ikan terpilih');
    this.setState({
      suggestions: [],
      cityId: item.id,
      value: item.name
    })
  }

  querySuggestion = (text) => {
    this.setState({ value: text })
    AsyncStorage.getItem('loginCredential', (err, result) => {
      axios.get(`${BASE_URL}/cities/search?key=${text}&pageSize=5sorting=ASC`, {
        headers: { 'x-access-token': result }
      })
        .then(response => {
          res = response.data.data
          this.setState({ suggestions: res })
          console.log(res, 'Auto Complete Nya')
        })
        .catch(error => {
          if (error.response) {
            alert('Internet anda Lemot')
          }
          else {
            alert('Koneksi internet bermasalah')
          }
        })
    });
  }


  showTanggalDPFocus() {
    console.log('FOCUS BRO');
    this.setState({ tanggalDP: true });
  }


  showTanggalPengirimanFocus() {
    console.log('Focus Bro')
    this.setState({ tanggalPenggiriman: true });
  }


  handleDatePickedPengiriman = (dateReceive) => {
    console.log(dateReceive, 'Date Nya Penerimaan')
    const dateTemps = moment(dateReceive).format('YYYY-MM-DD h:mm:ss');
    const dateNow = moment(dateReceive).format('DD/MM/YYYY');
    this.setState({ dateOfReception: dateTemps, dateNowPickPengiriman: dateNow })
    this.hideTanggalPengiriman();
    console.log(dateTemps, 'penerimaan tanggal');
  };

  showTanggalDP = () => this.setState({ tanggalDP: true });

  hideTanggalDP = () => this.setState({ tanggalDP: false });

  handleDatePickedDP = (date) => {
    console.log(date, 'Date Nya DP')
    const dateTemp = moment(date).format('YYYY-MM-DD h:mm:ss');
    const dateNow = moment(date).format('DD/MM/YYYY');
    this.setState({ dpDate: dateTemp, dateNowPickDP: dateNow })
    this.hideTanggalDP();
  };

  backPage() {
    const { navigate } = this.props.navigation
    Alert.alert(
      '',
      'Batal Mengisi Kontrak?',
      [
        { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Ya',
          onPress: () => {
            navigate('DetailTransactionPage')
          }
        },
      ]
    )
  }

  navigationRedirect() {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' }),
        NavigationActions.navigate({ routeName: 'DetailTransaction', params: { datas: this.props.navigation.state.params.datas } })
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }


  hideTanggalPengiriman = () => this.setState({ tanggalPenggiriman: false });

  showTanggalPengiriman = () => this.setState({ tanggalPenggiriman: true });

  checkItem = data => {
    console.log(data, 'Data Check')
    const { locationOfreception, locationEdit } = this.state;
    console.log(locationOfreception, 'Data Lokasi Sebelumnya');
    if (!locationOfreception.includes(data)) {
      this.setState({
        locationOfreception: [...locationOfreception, data],
        locationEdit: !locationEdit
      });
    } else {
      this.setState({
        locationOfreception: locationOfreception.filter(a => a !== data),
        locationEdit: !locationEdit
      });
    }
  };


  sum() {
    const { price, quantity } = this.state;
    // total
    const totLah = parseInt(price, 0) * parseInt(quantity, 0);

    // dp
    const dp = parseInt((totLah * 0.3), 0)
    this.setState({
      hargaTot: totLah,
      dpAmount: dp
    })
  }

  renderPickerCity = () => {
    const resultRender = this.state.dataMapCity;
    if (resultRender) {
      return resultRender.map((data, index) => {
        return <Picker.Item label={data.name} value={data.id} key={index} />
      })
    }
    return <Picker.Item label='Tidak ada Kota' value='0' />
  }


  renderButton = () => {
    if (this.state.loading) {
      return <Spinner size='large' />
    }

    return (
      <Button
        onPress={
          () => Alert.alert(
            '',
            'Sudah yakin dengan form kontrak anda ?',
            [
              { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              { text: 'Ya', onPress: () => this.onContract() },
            ]
          )
        }
      >
        Buat Kontrak
      </Button>
    )
  }


  render() {
    const {
      dateNowPickPengiriman,
      dateNowPickDP,

      fishDescribe,
      quantity,
      price,
      locationOfreception,
      dpAmount,

      fishReject,
      maxFishReject,
      size,
      dataMaster,
      locationEdit,
      hargaTot,
      value,
      suggestions,
      isDisabled
    } = this.state

    const addressBuyer = dataMaster.Request.Buyer.address;
    console.log(hargaTot, 'Harga Total');
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
      >
        <Container>

          <ContainerSection>
            <Text style={styles.headerStyle}>
              Informasi Komoditas
            </Text>
          </ContainerSection>

          <ContainerSection>
            <Input
              label="Nama Komoditas"
              value={this.state.dataMaster.Request.Transaction.Fish.name}
              style={styles.textArea}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label="Ukuran"
              value={size ? numeral(parseInt(size, 0)).format('0,0') : ''}
              onChangeText={v => this.onChangeInput('size', v.replace(/\./g, ''))}
              style={styles.textArea}
            />
            <View style={{ flex: 1, paddingTop: 50, paddingLeft: 10 }}>
              <Text>{this.state.dataMaster.Request.Transaction.unit}</Text>
            </View>
          </ContainerSection>

          <ContainerSection>
            <Input
              label="Jumlah"
              keyboardType="numeric"
              style={styles.textArea}
              value={quantity ? numeral(parseInt(quantity, 0)).format('0,0') : ''}
              onChangeText={v => this.onChangeInput('quantity', v.replace(/\./g, ''))}
            />
            <View style={{ flex: 1, paddingTop: 50, paddingLeft: 10 }}>
              <Text>Kg</Text>
            </View>
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Deskripsi Komoditas'
              value={fishDescribe}
              style={styles.textArea}
              onChangeText={v => this.onChangeInput('fishDescribe', v)}
              maxLength={40}
              multiline
              lines={4}
              textAlignVertical="top"
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Harga Per Kg'
              keyboardType="numeric"
              value={price ? numeral(parseInt(price, 0)).format('0,0') : ''}
              onChangeText={v => this.onChangeInput('price', v.replace(/\./g, ''))}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Harga Total'
              keyboardType="numeric"
              value={hargaTot.toString() ? numeral(parseInt(hargaTot, 0)).format('0,0') : ''}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Text style={styles.headerStyle}>
              Identitas Nelayan
            </Text>
          </ContainerSection>

          <ContainerSection>
            <Input
              label="Nama Lengkap"
              value={dataMaster.Request.Supplier.name}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label="No. KTP (Kartu Tanda Penduduk)"
              value={dataMaster.Request.Supplier.idNumber}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Nama Lembaga Nelayan'
              value={dataMaster.Request.Supplier.organization}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Lokasi Nelayan'
              value={dataMaster.Request.Supplier.City.name}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Text style={styles.headerStyle}>
              Lokasi Penerima Komoditas
              </Text>
          </ContainerSection>

          <CheckBox
            rightText='Lokasi penerimaan komoditas sama dengan lokasi pembeli'
            onClick={() => this.checkItem(addressBuyer)}
            isChecked={locationOfreception.includes(addressBuyer)}
          />

          <ContainerSection>
            <Input
              label='Lokasi Penerimaan'
              value={locationOfreception.toString()}
              style={styles.textArea}
              onChangeText={v => this.onChangeInput('locationOfreception', v)}
              maxLength={40}
              multiline
              numberOfLines={4}
              editable={locationEdit}
            />
          </ContainerSection>

          <ContainerSection>
            <AutoComplete
              label="Kota"
              placeholder="Kota"
              suggestions={suggestions}
              onChangeText={text => this.querySuggestion(text)}
              value={value}
              editable={isDisabled}
            >
              {
                suggestions && suggestions.map(item =>
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
            </AutoComplete>
          </ContainerSection>

          <ContainerSection>
            <Text style={styles.headerStyle}>
              Deskripsi Pengiriman
              </Text>
          </ContainerSection>

          <ContainerSection>
            <Input
              label="Nominal Dp"
              keyboardType="numeric"
              editable={false}
              value={dpAmount ? numeral(parseInt(dpAmount, 0)).format('0,0') : ''}
            />
          </ContainerSection>

          <TouchableWithoutFeedback onPress={this.showTanggalDP}>
            <View>
              <ContainerSection>
                <InputDate
                  label='Tanggal DP'
                  value={dateNowPickDP}
                  onChangeText={v => this.onChangeInput('dateNowPickDP', v)}
                  onFocus={() => this.showTanggalDPFocus()}
                />
              </ContainerSection>
            </View>
          </TouchableWithoutFeedback>
          <DateTimePicker
            isVisible={this.state.tanggalDP}
            onConfirm={this.handleDatePickedDP}
            onCancel={this.hideTanggalDP}
            minimumDate={new Date()}
          />

          <TouchableWithoutFeedback onPress={this.showTanggalPengiriman}>
            <View>
              <ContainerSection>
                <InputDate
                  label='Tanggal Penerimaan'
                  value={dateNowPickPengiriman}
                  onChangeText={v => this.onChangeInput('dateNowPickPengiriman', v)}
                  onFocus={() => this.showTanggalPengirimanFocus()}
                />
              </ContainerSection>
            </View>
          </TouchableWithoutFeedback>
          <DateTimePicker
            isVisible={this.state.tanggalPenggiriman}
            onConfirm={this.handleDatePickedPengiriman}
            onCancel={this.hideTanggalPengiriman}
            minimumDate={new Date()}
          />

          <ContainerSection>
            <Text style={styles.headerStyle}>
              Komoditas Reject
              </Text>
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Deskripsi Komoditas Reject'
              value={fishReject}
              onChangeText={v => this.onChangeInput('fishReject', v)}
              maxLength={40}
              multiline
              lines={4}
              textAlignVertical="top"
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Presentase Maksimal Komoditas Reject'
              keyboardType="numeric"
              value={maxFishReject ? numeral(parseInt(maxFishReject, 0)).format('0,0') : ''}
              onChangeText={v => this.onChangeInput('maxFishReject', v.replace(/\./g, ''))}
            />
          </ContainerSection>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <ContainerSection>
              {this.renderButton()}
            </ContainerSection>
          </View>
        </Container>
      </ScrollView>
    );
  }
}


const styles = {
  headerStyle: {
    color: COLOR.secondary_a,
    fontSize: 18,
  },
  pickerContainer: {
    flex: 1,
    marginBottom: 5
  },
  pickerStyle: {
    borderColor: '#a9a9a9',
    borderRadius: 5,
    paddingLeft: 7,
    borderWidth: 1,
  },
  pickerTextStyle: {
    color: '#5e5e5e',
    fontSize: 14,
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  },
  containerItemAutoSelect: {
    padding: 10,
  },
  thumb: {
    width: 30,
    height: 30,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  unitStyle: {
    marginTop: 30,
    paddingRight: 30
  },
  unitStyles: {
    marginTop: 30,
    paddingRight: 30,
    paddingLeft: 30
  },
  textArea: {
    height: 50,
    borderLine: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    width: 500
  },
  avatarContainer: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: 450,
    height: 180
  },
  pickerUnitStyle: {
    borderColor: '#a9a9a9',
    borderRadius: 5,
    paddingLeft: 7,
    borderWidth: 1,
    height: 50,
    backgroundColor: '#fff'
  },
}

export default FormContractPage
