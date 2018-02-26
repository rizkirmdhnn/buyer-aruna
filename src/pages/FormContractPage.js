import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import {
  View,
  ScrollView,
  Text,
  Alert,
  PixelRatio,
  AsyncStorage,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  ToastAndroid,
  Keyboard
} from 'react-native';
import axios from 'axios';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'

import {
  Input,
  Button,
  ContainerSection,
  Container,
  Spinner
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
                text: 'Ya', onPress: () => {
                  // navigate('DetailTransactionPage')
                  navigation.goBack()
                }
              },
            ]
          )
        }}
      >
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
    }
  }

  componentWillMount() {
    this.setState({
      dataMaster: this.props.navigation.state.params.datas
    });

    this.setState({ quantity: this.props.navigation.state.params.datas.Request.Transaction.quantity.toString() })

    console.log(this.props.navigation.state.params.datas.Request.Transaction.quantity, '123123');
  }

  onChangeInput = (name, v) => {
    this.setState({ [name]: v });
    // console.log(v);
  }

  onSubmit = () => {
    console.log(this.state.dpAmount, '', this.state.dateOfReception);

    if (this.state.quantity === '') {
      ToastAndroid.show('Anda belum mengisi Jumlah', ToastAndroid.SHORT)
    } 
    else if (this.state.price === '') {
      ToastAndroid.show('Anda belum mengisi Harga', ToastAndroid.SHORT)
    } 
    else if (this.state.dateNowPickPengiriman === '') {
      ToastAndroid.show('Anda belum menentukan Tanggal Pengiriman', ToastAndroid.SHORT)
    } 
    else if (this.state.locationOfreception === '') {
      ToastAndroid.show('Anda belum menentukan Lokasi Penerimaan', ToastAndroid.SHORT)
    } 
    else if (this.state.dpAmount === '') {
      ToastAndroid.show('Anda belum menentukan Nominal DP', ToastAndroid.SHORT)
    } 
    // else if (this.state.dpAmount >= this.state.price) {
    //     alert('Nominal DP tidak boleh Sama dengan atau Melebihi Total Harga');
    // } 
    else if (this.state.fishReject === '') {
      ToastAndroid.show('Anda belum mengisi Deskripsi Reject', ToastAndroid.SHORT)
    } 
    else if (this.state.maxFishReject === '') {
      ToastAndroid.show('Anda belum menentukan Presentase Reject', ToastAndroid.SHORT)
    }
    else {
      console.log('LOLOS')
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
        locationOfreception: this.state.locationOfreception,
        dateOfReception: this.state.dateOfReception,
        dpAmount: this.state.dpAmount,
        dpDate: this.state.dpDate,
        fishReject: this.state.fishReject,
        maxFishReject: this.state.maxFishReject
      }

      const idTransaction = this.state.dataMaster.id;

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
          })
          .catch(error => {
            if (error.response) {
              ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
            }
            else {
              ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
            }
          })
      })
    }
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

  navigationRedirect() {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'Home'}),
        NavigationActions.navigate({ routeName: 'DetailTransaction', params: { datas: this.props.navigation.state.params.datas }})
      ]
    })
    this.props.navigation.dispatch(resetAction)
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
      maxFishReject
    } = this.state

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
            
          </ContainerSection>

          <ContainerSection>
            <Input
              label="Jumlah"
              value={quantity}
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
              label='Harga'
              value={price}
              keyboardType="numeric"
              onChangeText={v => this.onChangeInput('price', v)}
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
              value={this.state.dataMaster.Request.Supplier.name}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label="No. KTP (Kartu Tanda Penduduk)"
              value={this.state.dataMaster.Request.Supplier.idNumber}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Nama Lembaga Nelayan'
              value={this.state.dataMaster.Request.Supplier.organization}
              editable={false}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Lokasi Nelayan'
              value={this.state.dataMaster.Request.Supplier.City.name}
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
            checked
          />

          <ContainerSection>
            <Input
              label='Lokasi Penerimaan'
              value={locationOfreception}
              style={styles.textArea}
              onChangeText={v => this.onChangeInput('locationOfreception', v)}
              maxLength={40}
              multiline
              numberOfLines={4}
            />
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
              value={dpAmount}
              onChangeText={v => this.onChangeInput('dpAmount', v)}
            />
          </ContainerSection>

          <TouchableWithoutFeedback onPress={this._showTanggalDP}>
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
            onConfirm={this._handleDatePickedDP}
            onCancel={this._hideTanggalDP}
            minimumDate={new Date()}
          />

          <TouchableWithoutFeedback onPress={this._showTanggalPengiriman}>
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
            onConfirm={this._handleDatePickedPengiriman}
            onCancel={this._hideTanggalPengiriman}
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
              value={maxFishReject}
              keyboardType="numeric"
              onChangeText={v => this.onChangeInput('maxFishReject', v)}
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
  }
}

export default FormContractPage
