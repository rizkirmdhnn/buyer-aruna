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
  TouchableNativeFeedback,
} from 'react-native';
import {
  CardRegistration,
  CardSectionRegistration,
  Input,
  Button,
  ContainerSection,
  Container,
  Spinner
} from './../components/common';
import AwesomeAlert from 'react-native-awesome-alerts';
import AutoComplete from '../components/AutoComplete';
import { BASE_URL, COLOR } from './../shared/lb.config';
import axios from 'axios';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'

import ImagePicker from 'react-native-image-picker';
import numeral from 'numeral'

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
                text: 'Ya', onPress: () => {
                  // navigate('DetailTransactionPage')
                  navigation.goBack()
                }
              },
            ]
          )
        }}>
        <Icon style={{marginLeft: 20, color: '#fff'}} name="md-arrow-back" size={24} />
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
      locationOfreception: '',
      dateOfReception: '',
      dpAmount: '',
      dpDate: '',
      fishReject: '',
      maxFishReject: ''


    };
  };


  componentWillMount() {
    this.setState({
      dataMaster: this.props.navigation.state.params.datas
    });


    this.setState({ quantity: this.props.navigation.state.params.datas.Request.Transaction.quantity.toString() });

    console.log(this.props.navigation.state.params.datas.Request.Transaction.quantity, '123123');
  }



  onChangeInput = (name, v) => {
    this.setState({ [name]: v });
    // console.log(v);
  }

  _showTanggalPengiriman = () => this.setState({ tanggalPenggiriman: true });

  _hideTanggalPengiriman = () => this.setState({ tanggalPenggiriman: false });

  _handleDatePickedPengiriman = (dateReceive) => {
    console.log(dateReceive, 'Date Nya Penerimaan')
    const dateTemps = moment(dateReceive).format('YYYY-MM-DD h:mm:ss');
    const dateNow = moment(dateReceive).format('DD/MM/YYYY');
    this.setState({ dateOfReception: dateTemps, dateNowPickPengiriman: dateNow })
    this._hideTanggalPengiriman();
    console.log(dateTemps, 'penerimaan tanggal');
  };

  _showTanggalDP = () => this.setState({ tanggalDP: true });

  _hideTanggalDP = () => this.setState({ tanggalDP: false });

  _handleDatePickedDP = (date) => {
    console.log(date, 'Date Nya DP')
    const dateTemp = moment(date).format('YYYY-MM-DD h:mm:ss');
    const dateNow = moment(date).format('DD/MM/YYYY');
    this.setState({ dpDate: dateTemp, dateNowPickDP: dateNow })
    this._hideTanggalDP();
  };

  backPage() {
    const { navigate } = this.props.navigation
    Alert.alert(
      '',
      'Batal Mengisi Kontrak?',
      [
        { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Ya', onPress: () => {
            navigate('DetailTransactionPage')
          }
        },
      ]
    )
  }

  onSubmit = () => {
    console.log(this.state.dpAmount, '', this.state.dateOfReception);

    // if (this.state.quantity == '') {
    //     alert('Anda belum mengisi Kuantitas');
    // } else if (this.state.price == '') {
    //     alert('Anda belum mengisi Total Harga');
    // } else if (this.state.dateNowPickPengiriman == '') {
    //     alert('Anda belum menentukan Tanggal Pengiriman');
    // } else if (this.state.locationOfreception == '') {
    //     alert('Anda belum menentukan Lokasi Penerimaan');
    // } else if (this.state.dpAmount == '') {
    //     alert('Anda belum menentukan Nominal DP');
    // } else if (this.state.dpAmount >= this.state.price ) {
    //     alert('Nominal DP tidak boleh Sama dengan atau Melebihi Total Harga');
    // } else if (this.state.fishReject == '') {
    //     alert('Anda belum mengisi Deskripsi Reject');
    // } else if (this.state.maxFishReject == '') {
    //     alert('Anda belum menentukan Presentase Reject');
    // }else {
    //     console.log('LOLOS');
    //     Keyboard.dismiss();\
    const dataContract = {
      "fishDescribe": this.state.fishDescribe,
      "size": this.state.dataMaster.Request.Transaction.size,
      "quantity": this.state.quantity,
      "price": this.state.price,
      "name": this.state.dataMaster.Request.Supplier.name,
      "idNumber": this.state.dataMaster.Request.Supplier.idNumber,
      "organization": this.state.dataMaster.Request.Supplier.organization,
      "location": this.state.dataMaster.Request.Supplier.City.name,
      "shippingMethod": 'JNE',
      "locationOfreception": this.state.locationOfreception,
      "dateOfReception": this.state.dateOfReception,
      "dpAmount": this.state.dpAmount,
      "dpDate": this.state.dpDate,
      "fishReject": this.state.fishReject,
      "maxFishReject": this.state.maxFishReject
    }

    const idTransaction = this.state.dataMaster.id;

    AsyncStorage.getItem('loginCredential', (err, result) => {
      console.log(dataContract, 'Data Contrak');
      console.log(idTransaction, 'ID Transaction');
      axios.post(`${BASE_URL}/buyer/orders/${idTransaction}/contracts`,
        dataContract
        , {
          headers: {
            'token': result,
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
        })
        .catch(error => {
          console.log(error.message, 'Error nya');
          console.log(error.response, 'Error nya');
          console.log(error, 'Error nya');
          alert(error.message.data)
        })
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
        Buat Kontrak
      </Button>
    )
  }

  onChangeInput = (name, v) => {
    this.setState({ [name]: v })
    console.log(v, 'Text Type');
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
    console.log(dpAmount, 'Dp Amount');
    const sizeConvert = { uri: `${BASE_URL}/images/${this.state.dataMaster.Request.Transaction.photo}` };
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
      >
        <Container>

          <CardSectionRegistration>
            <Text style={styles.headerStyle}>
              Informasi Komoditas
            </Text>
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label="Nama Komoditas"
              value={this.state.dataMaster.Request.Transaction.Fish.name}
              style={styles.textArea}
              editable={false}
            />
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label="Ukuran"
              value={this.state.dataMaster.Request.Transaction.size.toString()}
              style={styles.textArea}
            />
            <View style={{flex: 1, paddingTop: 50, paddingLeft: 10}}>
              <Input
                editable={false}
                value={this.state.dataMaster.Request.Transaction.Fish.unit.toString()}
                onChangeText={v => this.onChangeInput('quantity', v)}
              />
            </View>
            
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label="Jumlah"
              value={quantity}
              placeholder="Jumlah"
              keyboardType="numeric"
              style={styles.textArea}
              onChangeText={v => this.onChangeInput('quantity', v)}
            />
            <View style={{flex: 1, paddingTop: 50, paddingLeft: 10}}>
              <Input
                editable={false}
                value='Kg'
                onChangeText={v => this.onChangeInput('quantity', v)}
              />
            </View>
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label='Deskripsi Komoditas'
              placeholder='Ikan Segar'
              value={fishDescribe}
              style={styles.textArea}
              onChangeText={v => this.onChangeInput('fishDescribe', v)}
              maxLength={40}
              multiline={true}
              numberOfLines={4}
            />
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label='Harga'
              placeholder='Harga'
              value={price}
              keyboardType="numeric"
              onChangeText={v => this.onChangeInput('price', v)}
            />
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Text style={styles.headerStyle}>
              Identitas Nelayan
            </Text>
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label="Nama Lengkap"
              value={this.state.dataMaster.Request.Supplier.name}
              editable={false}
            />
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label="No. KTP (Kartu Tanda Penduduk)"
              value={this.state.dataMaster.Request.Supplier.idNumber}
              editable={false}
            />
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label='Nama Lembaga Nelayan'
              placeholder='Nama Lembaga Nelayan'
              value={this.state.dataMaster.Request.Supplier.organization}
              editable={false}
            />
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label='Lokasi Nelayan'
              placeholder='Lokasi Lengkap'
              value={this.state.dataMaster.Request.Supplier.City.name}
              editable={false}
            />
          </CardSectionRegistration>


          <CardSectionRegistration>
            <Text style={styles.headerStyle}>
              Lokasi Penerima Komoditas
              </Text>
          </CardSectionRegistration>

          <CheckBox
            title='Lokasi penerimaan komoditas sama dengan lokasi pembeli'
            checked="true"
          />

          <CardSectionRegistration>
            <Input
              label='Lokasi Penerimaan'
              placeholder='Lokasi Penerimaan'
              value={locationOfreception}
              style={styles.textArea}
              onChangeText={v => this.onChangeInput('locationOfreception', v)}
              maxLength={40}
              multiline={true}
              numberOfLines={4}
            />
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Text style={styles.headerStyle}>
              Deskripsi Pengiriman
              </Text>
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label="Nominal Dp"
              keyboardType="numeric"
              value={dpAmount}
              onChangeText={v => this.onChangeInput('dpAmount', v)}
            />
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label='Tanggal DP'
              value={dateNowPickDP}
              onChangeText={v => this.onChangeInput('dateNowPickDP', v)}
              editable={false}
            />
            <TouchableOpacity onPress={this._showTanggalDP}>
              <Image
                style={{
                  flexDirection: 'row',
                  borderColor: '#555',
                  borderRadius: 3,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  marginTop: 23,
                  width: 50,
                  height: 50
                }}
                source={require('./../assets/image/date-icon.png')}
              />
            </TouchableOpacity>
            <DateTimePicker
              isVisible={this.state.tanggalDP}
              onConfirm={this._handleDatePickedDP}
              onCancel={this._hideTanggalDP}
              minimumDate={new Date()}
            />
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label='Tanggal Penerimaan'
              placeholder='00/00/18'
              value={dateNowPickPengiriman}
              onChangeText={v => this.onChangeInput('dateNowPickPengiriman', v)}
              editable={false}
            />
            <TouchableOpacity onPress={this._showTanggalPengiriman}>
              <Image
                style={{
                  flexDirection: 'row',
                  borderColor: '#555',
                  borderRadius: 3,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  marginTop: 23,
                  width: 50,
                  height: 50
                }}
                source={require('./../assets/image/date-icon.png')}
              />
            </TouchableOpacity>
            <DateTimePicker
              isVisible={this.state.tanggalPenggiriman}
              onConfirm={this._handleDatePickedPengiriman}
              onCancel={this._hideTanggalPengiriman}
              minimumDate={new Date()}
            />
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Text style={styles.headerStyle}>
              Komoditas Reject
              </Text>
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label='Deskripsi Komoditas Reject'
              placeholder='Deskripsi Komoditas Reject'
              value={fishReject}
              onChangeText={v => this.onChangeInput('fishReject', v)}
            />
          </CardSectionRegistration>

          <CardSectionRegistration>
            <Input
              label='Presentase Maksimal Komoditas Reject'
              placeholder='Presentase Maksimal Komoditas Reject'
              value={maxFishReject}
              keyboardType="numeric"
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
    borderWidth: 1,
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

export default FormContractPage;