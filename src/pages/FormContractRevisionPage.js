
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import {
  View,
  ScrollView,
  Text,
  Alert,
  Picker,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  PixelRatio,
  AsyncStorage,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Input
} from 'react-native';
import {
  CardRegistration,
  CardSectionRegistration,
  InputRegistration,
  Button,
  ContainerSection,
  Container,
  Spinner
} from './../components/common';
import AwesomeAlert from 'react-native-awesome-alerts';
import AutoComplete from '../components/AutoComplete';
import { BASE_URL } from './../shared/lb.config';
import axios from 'axios';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { CheckBox } from 'react-native-elements'

import ImagePicker from 'react-native-image-picker';

class FormContractRevisionPage extends Component {

  static navigationOptions = {
    title: 'Edit Kontrak',
    headerStyle: { backgroundColor: '#006AAF' },
    headerTitleStyle: { color: '#FFFFFF' }
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
      locationOfreception: '',
      dateOfReception: '',
      dpAmount: '',
      dpDate: '',
      fishReject: '',
      maxFishReject: ''

    };
  };

  backPage() {
    const { navigate } = this.props.navigation
    Alert.alert(
      '',
      'Yakin batal mengubah fishlog?',
      [
        { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Ya', onPress: () => {
            navigate('DetailTransaction')
          }
        },
      ]
    )
  }

  componentWillMount() {
    this.setState({
      dataMaster: this.props.navigation.state.params.datas,
      loadingView: true
    });

    console.log(this.props.navigation.state.params.datas, 'Data Master Revision');

    AsyncStorage.getItem('loginCredential', (err, result) => {
      this.setState({ tokenUser: result })

      console.log(this.state.tokenUser, 'token')
      const idContract = this.state.dataMaster.id;
      axios.get(`${BASE_URL}/buyer/orders/${idContract}/contracts`,
      {
        headers: {
          'token': this.state.tokenUser,
          'Content-Type': 'application/json',
        }
      }).then(response => {
        res = response.data.data;
        console.log(res, 'Contract Data');
        this.setState({loadingView: false})
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

  _showTanggalPengiriman = () => this.setState({ tanggalPenggiriman: true });

  _hideTanggalPengiriman = () => this.setState({ tanggalPenggiriman: false });

  _handleDatePickedPengiriman = (date) => {
    console.log(date, 'Date Nya')
    const dateTemp = moment(date).format('YYYY-MM-DD h:mm:ss');
    const dateNow = moment(date).format('DD/MM/YYYY');
    this.setState({ dateOfReception: dateTemp, dateNowPickPengiriman: dateNow })
    this._hideTanggalPengiriman();
  };

  _showTanggalDP = () => this.setState({ tanggalDP: true });

  _hideTanggalDP = () => this.setState({ tanggalDP: false });

  _handleDatePickedDP = (date) => {
    console.log(date, 'Date Nya')
    const dateTemp = moment(date).format('YYYY-MM-DD h:mm:ss');
    const dateNow = moment(date).format('DD/MM/YYYY');
    this.setState({ dpDate: dateTemp, dateNowPickDP: dateNow })
    this._hideTanggalDP();
  };

  onSubmit = () => {
    console.log(this.state);

    const dataContract = {
      "fishDescribe": this.state.dataMaster.Request.Transaction.describe,
      "size": this.state.dataMaster.Request.Transaction.size,
      "quantity": this.state.dataMaster.Request.Transaction.quantity,
      "price": this.state.price,
      "name": this.state.dataMaster.Request.Supplier.name,
      "idNumber": this.state.dataMaster.Request.Supplier.idNumber,
      "organization": this.state.dataMaster.Request.Supplier.organization,
      "location": this.state.dataMaster.Request.Supplier.address,
      "shippingMethod": 'JNE',
      "locationOfreception": this.state.locationOfreception,
      "dateOfReception": this.state.dateOfReception,
      "dpAmount": this.state.dpAmount,
      "dpDate": this.state.dpDate,
      "fishReject": this.state.fishReject,
      "maxFishReject": this.state.maxFishReject
    }

    const idContract = this.state.dataMaster.id;

    console.log(dataContract, 'Data Contrak');
    console.log(idContract, 'ID Transaction');
    axios.put(`${BASE_URL}/buyer/orders/${idContract}/contracts`,
      dataContract
      , {
        headers: {
          'token': this.state.tokenUser,
          'Content-Type': 'application/json',
        }
      }).then(response => {
        res = response.data.data;
        console.log(response, 'RES');

        Alert.alert(
          '',
          'Data kontrak berhasil diedit. Silahkan tunggu jawaban dari Nelayan',
          [
            { text: 'Ok', onPress: () => this.navigationRedirect() },
          ]
        )
      })
      .catch(error => {
        console.log(error.message, 'Error nya');
        console.log(error.response, 'Error nya');
        console.log(error, 'Error nya');
        alert(error.data)
      })
  }

  navigationRedirect() {
    const { navigate } = this.props.navigation
    navigate('Transaction');
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
              { text: 'Ya', onPress: () => this.onSubmit() },
            ]
          )
        }
      >
        Selanjutnya
      </Button>
    )
  }

  renderAllData = () => {
    const {
      loading,
      photo,
      dataMaster,
      dateNowPickPengiriman,
      dateNowPickDP,

      fishDescribe,
      size,
      quantity,
      price,
      name,
      idNumber,
      organization,
      location,
      shippingMethod,
      locationOfreception,
      dateOfReception,
      dpAmount,
      dpDate,
      fishReject,
      maxFishReject
      } = this.state

    const sizeConvert = { uri: `${BASE_URL}/images/${this.state.dataMaster.Request.Transaction.photo}` };

    if (this.state.loadingView == true) {
      return <Spinner size='large' />
    } else if (this.state.loadingView == false) {

      return (
        <ScrollView
          keyboardShouldPersistTaps="always"
        >
          <Container>

            <CardSectionRegistration>
              <Text style={styles.headerStyle}>
                INFORMASI KOMODITAS
              </Text>
            </CardSectionRegistration>

            <CardSectionRegistration>
              <View style={styles.container}>
                <View style={[styles.avatar, styles.avatarContainer, { resizeMode: 'stretch' }]}>
                  <Image style={[styles.avatar, { resizeMode: 'stretch' }]} source={sizeConvert} />
                </View>
              </View>
            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                label="Nama Komoditas"
                value={this.state.dataMaster.Request.Transaction.Fish.name}
                style={styles.textArea}
                editable={false}
              />
            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                label="Ukuran"
                value={this.state.dataMaster.Request.Transaction.size.toString()}
                style={styles.textArea}
                editable={false}
              />
              <Text style={styles.unitStyle}> kg/pcs</Text>

              <InputRegistration
                label="Kuantitas"
                value={this.state.dataMaster.Request.Transaction.quantity.toString()}
                style={styles.textArea}
                editable={false}
              />
              <Text style={styles.unitStyle}> kg</Text>

            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                value={this.state.dataMaster.Request.Transaction.describe}
                style={styles.textArea}
                editable={false}
              />
            </CardSectionRegistration>


            <CardSectionRegistration>
              <InputRegistration
                label="Total Harga"
                placeholder='Total Harga'
                value={price}
                style={styles.textArea}
                onChangeText={v => this.onChangeInput('price', v)}
              />
            </CardSectionRegistration>

            <View>
              <Text style={styles.unitStyle}>IDENTITAS NELAYAN</Text>
            </View>

            <CardSectionRegistration>
              <InputRegistration
                label="Nama"
                value={this.state.dataMaster.Request.Supplier.name}
                editable={false}
              />
            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                label="Nomor KTP"
                value={this.state.dataMaster.Request.Supplier.idNumber}
                editable={false}
              />
            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                label='Nama Lembaga Nelayan'
                placeholder='Nama Lembaga Nelayan'
                value={this.state.dataMaster.Request.Supplier.organization}
                editable={false}
              />
            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                label='Lokasi Nelayan'
                placeholder='Lokasi Lengkap'
                value={this.state.dataMaster.Request.Supplier.address}
                editable={false}
              />
            </CardSectionRegistration>

            <CardSectionRegistration>
              <Text style={styles.headerStyle}>
                DESKRIPSI PENGIRIMAN
              </Text>
            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                label='Tanggal Pengiriman'
                placeholder='Tanggal Pengiriman'
                value={dateNowPickPengiriman}
                onChangeText={v => this.onChangeInput('dateNowPickPengiriman', v)}
                editable={false}
              />
              <TouchableOpacity onPress={this._showTanggalPengiriman}>
                <Image
                  style={{ marginTop: 10, width: 50, height: 50 }}
                  source={require('./../assets/image/date-icon.png')}
                />
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.tanggalPenggiriman}
                onConfirm={this._handleDatePickedPengiriman}
                onCancel={this._hideTanggalPengiriman}
              />
            </CardSectionRegistration>

            <CardSectionRegistration>
              <Text style={styles.headerStyle}>
                LOKASI PENERIMA KOMODITAS
              </Text>
            </CardSectionRegistration>

            <CardSectionRegistration>
              <CheckBox
                title='Lokasi penerimaan komoditas sama dengan lokasi pembeli'
                checked="true"
              />
            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                label='Lokasi Penerimaan'
                placeholder='Lokasi Lengkap'
                value={locationOfreception}
                onChangeText={v => this.onChangeInput('locationOfreception', v)}
              />
            </CardSectionRegistration>

            <CardSectionRegistration>
              <Text style={styles.headerStyle}>
                DESKRIPSI PENERIMAAN
              </Text>
            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                label='Nominal DP'
                placeholder='Nominal DP'
                value={dpAmount}
                onChangeText={v => this.onChangeInput('dpAmount', v)}
              />
            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                label='Tanggal DP'
                placeholder='Tanggal DP'
                value={dateNowPickDP}
                onChangeText={v => this.onChangeInput('dateNowPickDP', v)}
                editable={false}
              />
              <TouchableOpacity onPress={this._showTanggalDP}>
                <Image
                  style={{ marginTop: 10, width: 50, height: 50 }}
                  source={require('./../assets/image/date-icon.png')}
                />
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.tanggalDP}
                onConfirm={this._handleDatePickedDP}
                onCancel={this._hideTanggalDP}
              />
            </CardSectionRegistration>

            <CardSectionRegistration>
              <Text style={styles.headerStyle}>
                KOMODITAS REJECT
              </Text>
            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                label='Deskripsi Komoditas Reject'
                placeholder='Deskripsi Komoditas Reject'
                value={fishReject}
                onChangeText={v => this.onChangeInput('fishReject', v)}
              />
            </CardSectionRegistration>

            <CardSectionRegistration>
              <InputRegistration
                label='Presentase Maksimal Komoditas Reject'
                placeholder='Presentase Maksimal Komoditas Reject'
                value={maxFishReject}
                onChangeText={v => this.onChangeInput('maxFishReject', v)}
              />
            </CardSectionRegistration>

          </Container>

          <ContainerSection>
            {this.renderButton()}
          </ContainerSection>

        </ScrollView>
      )
    }
  }



  render() {
    return (
      <View>
        {this.renderAllData()}
      </View>
    );
  }
};


const styles = {
  headerStyle: {
    marginLeft: 5,
    fontWeight: 'bold'
  },
  pickerTextStyle: {
    color: '#8e8e8e',
    flex: 1,
    paddingLeft: 5
  },
  pickerContainer: {
    flex: 1,
    height: 65,
    marginBottom: 5
  },
  pickerTextStyle: {
    color: '#8e8e8e',
    paddingLeft: 5,
    fontSize: 16
  },
  pickerStyle: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#716c6c',
    marginRight: 3,
    marginLeft: 3,
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
    paddingRight: 30,
    fontWeight: 'bold',
  },
  unitStyles: {
    marginTop: 30,
    paddingRight: 30,
    paddingLeft: 30
  },
  textArea: {
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  avatarContainer: {
    borderRadius: 10,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    // resizeMode: 'stretch',
    width: 320,
    height: 130
  }
}

export default FormContractRevisionPage;