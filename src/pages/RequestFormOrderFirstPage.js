import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import numeral from 'numeral';
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
} from 'react-native';
import {
  Input,
  Button,
  ContainerSection,
  Container,
  Spinner
} from './../components/common';
import AwesomeAlert from 'react-native-awesome-alerts';
import AutoComplete from '../components/AutoComplete';
import { BASE_URL, COLOR } from '../shared/lb.config';
import axios from 'axios';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

class RequestFormOrderFirstPage extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'Buat Permintaan',
    headerLeft:
      <TouchableOpacity
        onPress={() => { navigation.navigate('Home') }}
      >
        <Image
          style={{ width: 20, height: 20, marginLeft: 30 }}
          source={require('./../assets/images/back.png')} />
      </TouchableOpacity>,
    headerRight: <View />
  });

  goBack() {
    const { navigate } = this.props.navigation;
    navigate('Home');
  }

  constructor(props) {
    super(props);
    this.state = {
      dataParams: '',
      load: null,
      loading: null,
      loadButton: null,
      unitFish: '',
      dataMapCity: '',
      dataCity: '',
      dataProvinsi: '',
      suggestions: [],
      value: '',
      FishId: '',

      provinsiId: '',
      cityId: '',
      size: '',
      deskripsi: '',

      quantity: '',
      minBudget: '',
      maxBudget: '',
      datePick: '',
      dateNowPick: '',
      photo: null
    };
  };


  onChangeInput = (name, v) => {
    this.setState({ [name]: v });
    console.log(v);
  }


  state = {
    isDateTimePickerVisible: false,
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log(date, 'Date Nya')
    const dateTemp = moment(date).format('YYYY-MM-DD h:mm:ss');
    const dateNow = moment(date).format('DD/MM/YYYY');
    this.setState({ datePick: dateTemp, dateNowPick: dateNow })
    this._hideDateTimePicker();
  };

  onSubmit = () => {
    console.log(this.state, 'DATA FORM 1');

    if (this.state.photo == null) {
      alert('Anda belum upload Foto');
    } else if (this.state.FishId == '') {
      alert('Anda belum memilih Komoditas');
    } else if (this.state.size == '') {
      alert('Anda belum menentukan Ukuran');
    } else if (this.state.quantity == '') {
      alert('Anda belum menentukan Kuantitas');
    } else if (this.state.deskripsi == '') {
      alert('Anda belum menentukan Deskripsi Komoditas');
    } else if (this.state.maxBudget == '') {
      alert('Anda belum menentukan max Harga')
    } else if (this.state.dateNowPick == '') {
      alert('Anda belum menentuan tanggal Permintaan')
    } else if (this.state.provinsiId == '') {
      alert('anda belum memilih Provinsi');
    } else if (this.state.cityId == '') {
      alert('Anda belum memilih Kota')
    } else {
      console.log('LOLOS');
      Keyboard.dismiss();
      const data = this.state;
      console.log(this.state.photo, 'DATA LEMPAR');
      this.props.navigation.navigate('RequestFormOrderSecond', { datas: data, dataFirst: this.state.dataParams })
    }
  }

  renderButton = () => {
    if (this.state.loadButton) {
      return <Spinner size='large' />
    }

    return (
      <Button
        onPress={
          () => this.onSubmit()
        }
      >
        Selanjutnya
      </Button>
    )
  }


  querySuggestion = (text) => {
    this.setState({ value: text })
    AsyncStorage.getItem('loginCredential', (err, result) => {

      axios.get(`${BASE_URL}/fishes/search?key=${text}`, {
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

  componentWillMount() {
    console.log(this.state.photo, 'POTO DEFAULT');
    this.setState({ loading: true });

    const { params } = this.props.navigation.state
    console.log(params, 'Data Form Order Parsing')

    if (params && params.FishId !== '') {
      this.setState({
        value: params.dataFish.name,
        FishId: params.dataFish.id,
        dataParams: params
      })
    }

    AsyncStorage.getItem('loginCredential', (err, resultToken) => {

      axios.get(`${BASE_URL}/provinces`, {
        headers: { 'x-access-token': resultToken }
      })
        .then(response => {
          res = response.data.data
          const resultDataCity = res
          this.setState({ dataProvinsi: resultDataCity, loading: false });
        })
        .catch(error => {
          if (error.response) {
            alert(error.response.data.message)
          }
          else {
            alert('Koneksi internet bermasalah Provinsi')
          }
        })
    });
  }

  renderProvinceCity = () => {
    const dataProvCity = this.state.dataProvinsi;
    return dataProvCity.map((data, index) => {
      return <Picker.Item label={data.name} value={data.id} key={index} />
    })
  }


  onChangeProvince = (name, v) => {
    this.setState({ [name]: v });
    console.log(v, this.state.load, 'Value DropDown Provinci');

    AsyncStorage.getItem('loginCredential', (err, resultToken) => {
      axios.get(`${BASE_URL}/cities/search-province/${v}`, {
        headers: { 'x-access-token': resultToken }
      })
        .then(response => {
          const result = response.data.data;
          console.log(result, 'Data City');
          this.setState({ dataMapCity: result });
          console.log(this.state.dataMapCity, 'Lemparan ID City');
        })
        .catch(error => {
          if (error.response) {
            alert(error.response.data.message)
          }
          else {
            alert('Koneksi internet bermasalah')
          }
        })
    });
  }

  renderPickerCity = () => {
    if (this.state.dataMapCity === '') {
      return <Picker.Item label='Pilih Kota' value='0' />
    } else {
      const resultRender = this.state.dataMapCity;
      return resultRender.map((data, index) => {
        return <Picker.Item label={data.name} value={data.id} key={index} />
      })
    }
  }

  renderUkuran = () => {
    const x = ['Kg', 'Cm', 'Ekor/Kg']
    return x.map((data, index) => {
      console.log(data, index)
      return <Picker.Item label={data} value={data} key={index} />
    })
  }

  onItemSelected = (item) => {
    console.log(item, 'Ikan terpilih');
    this.setState({
      suggestions: [],
      FishId: item.id,
      value: item.name
    })
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };


    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          photo: source
        });
      }
    });
  }

  render() {
    const {
      dataMapCity,
      dataCity,
      dataProvinsi,
      suggestions,
      value,
      provinsiId,
      cityId,
      size,
      quantity,
      minBudget,
      maxBudget,
      deskripsi,
      datePick,
      dateNowPick,
      photo,
      loading,
      unitFish
    } = this.state

    if (loading) {
      return <Spinner size="large" />
    }
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
      >
        <Container>

          <ContainerSection>
            <Text style={styles.headerStyle}>
              Unggah Foto Ikan
            </Text>
          </ContainerSection>

          <ContainerSection>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                <View>
                  {this.state.photo === null ?
                    <Image
                      source={require('../assets/images/ic_add_a_photo.png')}
                    />
                    :
                    <Image style={{ height: 200, width: 300 }} source={this.state.photo} />
                  }
                </View>
              </TouchableOpacity>
            </View>
          </ContainerSection>

          <ContainerSection>
            <Text style={styles.headerStyle}>
              Informasi Komoditas
            </Text>
          </ContainerSection>

          <ContainerSection>
            <AutoComplete
              label="Nama Komoditas"
              placeholder="Komoditas"
              suggestions={suggestions}
              onChangeText={text => this.querySuggestion(text)}
              value={value}
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
            <Input
              label='Ukuran'
              placeholder=''
              keyboardType="numeric"
              value={size ? numeral(parseInt(size)).format('0,0') : ''}
              onChangeText={v => this.onChangeInput('size', v.replace(/\./g, ''))}
            />
            <View style={{marginTop: 50, marginLeft: 10, flex: 1}}>
              <View style={styles.pickerUnitStyle}>
                <Picker
                  selectedValue={unitFish}
                  onValueChange={v => this.onChangeInput('unitFish', v)}
                >
                  <Picker.Item label='Kg' value='Kg' />
                  <Picker.Item label='Cm' value='Cm' />
                  <Picker.Item label='Ekor/Kg' value='Ekor/Kg' />
                </Picker>
              </View>
            </View>
          </ContainerSection>

          <ContainerSection>
            <Input
              keyboardType="numeric"
              label='Jumlah'
              placeholder=''
              value={quantity ? numeral(parseInt(quantity)).format('0,0') : ''}
              onChangeText={v => this.onChangeInput('quantity', v.replace(/\./g, ''))}
            />
            <View style={{ flex: 1, paddingTop: 50, paddingLeft: 10 }}>
              <Text>Kg</Text>
            </View>
          </ContainerSection>

          <ContainerSection>
            <Input
              label='Deskripsi Komoditas'
              placeholder='Deskripsi'
              value={deskripsi}
              style={styles.textArea}
              onChangeText={v => this.onChangeInput('deskripsi', v)}
              maxLength={40}
              multiline
              textAlignVertical="top"
              lines={4}
            />
          </ContainerSection>

          <ContainerSection>
            <Input
              keyboardType="numeric"
              label='Harga Maksimal'
              placeholder='Rupiah/kg'
              value={maxBudget ? numeral(parseInt(maxBudget)).format('0,0') : ''}
              onChangeText={v => this.onChangeInput('maxBudget', v.replace(/\./g, ''))}
            />
          </ContainerSection>

          <ContainerSection>
            <Text style={styles.headerStyle}>
              Informasi Pengiriman
            </Text>
          </ContainerSection>

          <TouchableOpacity onPress={this._showDateTimePicker}>
            <ContainerSection>
              <Input
                label="Tanggal Pengiriman"
                value={dateNowPick}
                onChangeText={v => this.onChangeInput('dateNowPick', v)}
                editable={false}
                onPress={this._showDateTimePicker}
                style={{ width: '100%' }}
              />
            </ContainerSection>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            minimumDate={new Date()}
          />

          <ContainerSection>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTextStyle}>Provinsi</Text>
              <View style={styles.pickerStyle}>
                <Picker
                  selectedValue={provinsiId}
                  onValueChange={v => this.onChangeProvince('provinsiId', v)}
                >
                  <Picker.Item label='Pilih Provinsi' value='0' />
                  {this.renderProvinceCity()}
                </Picker>
              </View>
            </View>
          </ContainerSection>

          <ContainerSection>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTextStyle}>Kota/Kabupaten</Text>
              <View style={styles.pickerStyleBox}>
                <View style={styles.pickerStyle}>
                  <Picker
                    selectedValue={cityId}
                    onValueChange={v => this.onChangeInput('cityId', v)}
                  >
                    {this.renderPickerCity()}
                  </Picker>
                </View>
              </View>
            </View>
          </ContainerSection>

          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <ContainerSection>
              {this.renderButton()}
            </ContainerSection>
          </View>

        </Container>
      </ScrollView >
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
  pickerUnitStyle: {
    borderColor: '#a9a9a9',
    borderRadius: 5,
    paddingLeft: 7,
    borderWidth: 1,
    height: 46,
    backgroundColor: '#fff'
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

export default RequestFormOrderFirstPage;
