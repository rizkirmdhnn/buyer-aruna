
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import {
  View,
  ScrollView,
  Text,
  Alert,
  PixelRatio,
  AsyncStorage,
  TouchableWithoutFeedback,
  Image,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { CheckBox } from 'react-native-elements'
import numeral from 'numeral';
import {
  Input,
  Button,
  ContainerSection,
  Container,
  Spinner
} from './../components/common';
import { BASE_URL, COLOR } from './../shared/lb.config';

class FormContractRevisionPage extends Component {

  static navigationOptions = {
    title: 'Edit Kontrak',
    headerRight: <View />
  }

  constructor(props) {
    super(props);
    this.state = {
      tokenUser: '',

      tanggalPenggiriman: false,
      tanggalDP: false,
      loading: null,
      loadingView: null,
      photo: null,
      dataMaster: '',
      dataTemp: '',
      dateNowPickPengiriman: '',
      dateNowPickDP: '',
      locationSupplier: '',

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
      shareLoc: '',
      locationEdit: false
    };
  }


  componentWillMount() {
    console.log(this.props.navigation.state.params.datas, 'Data Parsing');
    this.setState({
      dataMaster: this.props.navigation.state.params.datas,
      loadingView: true
    });

    this.setState({
      quantity: this.props.navigation.state.params.datas.Request.Transaction.quantity.toString(),
      size: this.props.navigation.state.params.datas.Request.Transaction.size,
      fishDescribe: this.props.navigation.state.params.datas.Request.Transaction.describe
    })

    AsyncStorage.getItem('loginCredential', (err, result) => {
      this.setState({ tokenUser: result })
      const idContract = this.state.dataMaster.id;
      axios.get(`${BASE_URL}/buyer/orders/${idContract}/contracts`,
        {
          headers: {
            token: this.state.tokenUser,
            'Content-Type': 'application/json',
          } 
        }).then(response => {
          res = response.data.data;
          console.log(res, 'Data Temp Res');
          const { locationOfreception } = this.state;
          if (res.Contract.locationOfreception === res.Contract.Buyer.address) {
            this.setState({ locationOfreception: [...locationOfreception, res.Contract.Buyer.address] })
          } else {
            this.setState({ locationOfreception: [...locationOfreception, res.Contract.locationOfreception] })
          }
          this.setState({
            price: res.Contract.price,
            dpAmount: res.Contract.dpAmount,
            dateNowPickDP: moment(res.Contract.dpDate).format('DD/MM/YYYY'),
            dateNowPickPengiriman: moment(res.Contract.dateOfReception).format('DD/MM/YYYY'),
            locationSupplier: res.Contract.Supplier.City.Province.name,
            dataTemp: res, 
            loadingView: false,
            fishReject: res.Contract.fishReject,
            maxFishReject: res.Contract.maxFishReject 
          })
        })
        .catch(error => {
          console.log(error, 'Error nya');
          alert(error.message.data)
        })
    })
  }

  onChangeInput = (name, v) => {
    this.setState({ [name]: v });
    // console.log(v);
  }


  onContractRevision() {
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
      maxFishReject
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
                  return ToastAndroid.show('Deskripsi Komoditas Minimal 4 Huruf')
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


  onSubmit = () => {
    this.setState({ loading: true });
    console.log(this.state.locationOfreception, 'RWRWRWRWRWRWRRWRWR');
    this.state.locationOfreception.map((data) => this.setState({ shareLoc: data }))

    const dataContract = {
      fishDescribe: this.state.dataMaster.Request.Transaction.describe,
      size: this.state.dataMaster.Request.Transaction.size,
      quantity: this.state.dataMaster.Request.Transaction.quantity,
      price: this.state.price,
      name: this.state.dataMaster.Request.Supplier.name,
      idNumber: this.state.dataMaster.Request.Supplier.idNumber,
      organization: this.state.dataMaster.Request.Supplier.organization,
      location: this.state.dataTemp.Contract.Supplier.City.Province.name,
      shippingMethod: 'JNE',
      locationOfreception: this.state.shareLoc,
      dateOfReception: this.state.dateNowPickPengiriman,
      dpAmount: this.state.dpAmount,
      dpDate: this.state.dateNowPickDP,
      fishReject: this.state.fishReject,
      maxFishReject: this.state.maxFishReject
    }

    const idContract = this.state.dataMaster.id;
    console.log(dataContract, 'Data Contract');
    axios.post(`${BASE_URL}/buyer/orders/${idContract}/contracts`,
      dataContract
      , {
        headers: {
          token: this.state.tokenUser,
          'Content-Type': 'application/json',
        }
      }).then(response => {
        res = response.data.data;
        console.log(response, 'RES');
        this.setState({ loading: false })
        ToastAndroid.show('Data kontrak berhasil diedit. Silahkan tunggu jawaban dari Nelayan', ToastAndroid.SHORT)
        this.navigationRedirect();
      })
      .catch(error => {
        console.log(error.response, 'Error');
        if (error.response) {
          ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
        }
        else {
          ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
        }
      })
  }


  showTanggalDP = () => this.setState({ tanggalDP: true });

  hideTanggalDP = () => this.setState({ tanggalDP: false });

  handleDatePickedDP = (date) => {
    console.log(date, 'Date Nya')
    const dateTemp = moment(date).format('YYYY-MM-DD h:mm:ss');
    const dateNow = moment(date).format('DD/MM/YYYY');
    this.setState({ dpDate: dateTemp, dateNowPickDP: dateNow })
    this.hideTanggalDP();
  };

  handleDatePickedPengiriman = (date) => {
    console.log(date, 'Date Nya')
    const dateTemp = moment(date).format('YYYY-MM-DD h:mm:ss');
    const dateNow = moment(date).format('DD/MM/YYYY');
    this.setState({ dateOfReception: dateTemp, dateNowPickPengiriman: dateNow })
    this.hideTanggalPengiriman();
  };

  hideTanggalPengiriman = () => this.setState({ tanggalPenggiriman: false });

  showTanggalPengiriman = () => this.setState({ tanggalPenggiriman: true });

  backPage() {
    const { navigate } = this.props.navigation
    Alert.alert(
      '',
      'Yakin batal mengubah fishlog?',
      [
        { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Ya',
          onPress: () => {
            navigate('DetailTransaction')
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

  checkItem = data => {
    console.log(data, 'Data Check')
    const { locationOfreception, locationEdit } = this.state;
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
              { text: 'Ya', onPress: () => this.onContractRevision() },
            ]
          )
        }
      >
        Selanjutnya
      </Button>
    )
  }

  render() {
    const {
      dateNowPickPengiriman,
      dateNowPickDP,

      locationSupplier,

      price,
      locationOfreception,
      dpAmount,
      fishReject,
      maxFishReject,
      dataMaster,
      size,
      quantity,
      fishDescribe,
      locationEdit,
      dataTemp
    } = this.state

    const sizeConvert = { uri: `${BASE_URL}/images/${this.state.dataMaster.Request.Transaction.photo}` };
    const addressBuyer = dataMaster.Request.Buyer.address;
    console.log(dataTemp, 'Data Temp');
   

    if (this.state.loadingView === true) {
      return <Spinner size='large' />
    }

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
            <View style={styles.container}>
              <View style={[styles.avatar, styles.avatarContainer]}>
                <Image style={[styles.avatar, { resizeMode: 'stretch' }]} source={sizeConvert} />
              </View>
            </View>
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
              style={styles.textArea}
              value={size ? numeral(parseInt(size, 0)).format('0,0') : ''}
              onChangeText={v => this.onChangeInput('size', v.replace(/\./g, ''))}
            />
            <View style={{ flex: 1, paddingTop: 20, paddingLeft: 10 }}>
              <Text style={styles.unitStyle}> kg/pcs</Text>
            </View>

            <Input
              label="Jumlah"
              style={styles.textArea}
              value={quantity ? numeral(parseInt(quantity, 0)).format('0,0') : ''}
              onChangeText={v => this.onChangeInput('quantity', v.replace(/\./g, ''))}
            />
            <View style={{ flex: 1, paddingTop: 25, paddingLeft: 10 }}>
              <Text style={styles.unitStyle}> kg</Text>
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
              label="Harga"
              keyboardType="numeric"
              style={styles.textArea}
              value={price ? numeral(parseInt(price, 0)).format('0,0') : ''}
              onChangeText={v => this.onChangeInput('price', v.replace(/\./g, ''))}
            />
          </ContainerSection>

          <ContainerSection>
            <Text style={styles.headerStyle}>
              Identitas Nelayan
            </Text>
          </ContainerSection>

          <ContainerSection>
            <Input
              label="Nama"
              value={this.state.dataMaster.Request.Supplier.name}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label="Nomor KTP"
              value={this.state.dataMaster.Request.Supplier.idNumber}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Nama Lembaga Nelayan'
              placeholder='Nama Lembaga Nelayan'
              value={this.state.dataMaster.Request.Supplier.organization}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Lokasi Nelayan'
              value={locationSupplier}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Text style={styles.headerStyle}>
              Lokasi Penerima Komoditas
              </Text>
          </ContainerSection>

          <CheckBox
            title='Lokasi penerimaan komoditas sama dengan lokasi pembeli'
            onPress={() => this.checkItem(addressBuyer)}
            checked={locationOfreception.includes(addressBuyer)}
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
            <Text style={styles.headerStyle}>
              Deskripsi Penerimaan
            </Text>
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Nominal DP'
              keyboardType="numeric"
              value={dpAmount ? numeral(parseInt(dpAmount, 0)).format('0,0') : ''}
              onChangeText={v => this.onChangeInput('dpAmount', v.replace(/\./g, ''))}
            />
          </ContainerSection>

          <TouchableWithoutFeedback onPress={this.showTanggalDP}>
            <View>
              <ContainerSection>
                <Input
                  label='Tanggal DP'
                  value={dateNowPickDP}
                  onChangeText={v => this.onChangeInput('dateNowPickDP', v)}
                  editable={false}
                />
              </ContainerSection>
            </View>
          </TouchableWithoutFeedback>
          <DateTimePicker
            isVisible={this.state.tanggalDP}
            onConfirm={this.handleDatePickedDP}
            onCancel={this.hideTanggalDP}
          />

          <TouchableWithoutFeedback onPress={this.showTanggalPengiriman}>
            <View>
              <ContainerSection>
                <Input
                  label='Tanggal Penerimaan'
                  value={dateNowPickPengiriman}
                  onChangeText={v => this.onChangeInput('dateNowPickPengiriman', v)}
                  editable={false}
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
    )
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
    backgroundColor: 'transparent',
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
  }
}

export default FormContractRevisionPage;
