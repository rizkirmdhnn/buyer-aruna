import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Text,
  Picker,
  Keyboard,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid
} from 'react-native';
import axios from 'axios';
import { NavigationActions } from 'react-navigation'
import ImagePicker from 'react-native-image-picker';

/**
 *  Import Common
 */
import { Container, ContainerSection, Spinner, Input, Button } from './../components/common'
import { BASE_URL, COLOR } from '../shared/lb.config';

class RegistrationFormPage extends Component {
  static navigationOptions = {
    title: 'Pendaftaran Akun',
    headerRight: <View />
  }

  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      loading: null,
      loader: null,

      organization: '',
      organizationType: '',
      addressInstitution: '',
      npwp: '',
      email: '',

      name: '',
      idNumber: '',
      address: '',
      phone: '',
      username: '',
      password: '',
      repassword: '',
      idCity: '',
      dataCity: '',


      idPhoto: null,
      npwpPhoto: null,
      profilePhoto: null,

      pathKtp: null,
      pathNpwp: null,
      pathProfile: null
    };
  }


  componentWillMount() {
    this.setState({ loading: true });
    axios.get(`${BASE_URL}/cities`, {
      params: {
        pageSize: 30,
        sorting: 'ASC'
      }
    })
      .then(response => {
        res = response.data.data
        this.setState({
          dataCity: res,
          loading: false
        })
        console.log(res, 'Data City');
      })
      .catch(error => {
        console.log(error, 'Error');
        this.setState({ loading: false })
        alert('Koneksi internet bermasalah on item selected')
      })
  }

  onChangeInput = (name, v) => {
    this.setState({ [name]: v })
  }

  onRegister() {
    this.setState({ loader: true })

    const dataPhoto = new FormData();
    dataPhoto.append('name', this.state.name);
    dataPhoto.append('email', this.state.email);
    dataPhoto.append('username', this.state.username);
    dataPhoto.append('password', this.state.repassword);
    dataPhoto.append('phone', this.state.phone);
    dataPhoto.append('organization', this.state.organization);
    dataPhoto.append('organizationType', this.state.organizationType);
    dataPhoto.append('idNumber', this.state.idNumber);
    dataPhoto.append('address', this.state.address);
    dataPhoto.append('idPhoto', {
      uri: this.state.idPhoto.uri,
      type: 'image/jpeg',
      name: 'ktpImage.jpeg'
    });
    dataPhoto.append('npwp', this.state.npwp);
    dataPhoto.append('photo', {
      uri: this.state.profilePhoto.uri,
      type: 'image/jpeg',
      name: 'profile.jpeg'
    });
    dataPhoto.append('npwpPhoto', {
      uri: this.state.npwpPhoto.uri,
      type: 'image/jpeg',
      name: 'npwpImage.jpeg'
    });

    console.log(dataPhoto, 'Data formData');
    console.log(this.state, 'Data State');
    axios.post(`${BASE_URL}/buyer/register`,
      dataPhoto
      , {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(response => {
        console.log(response, 'Response');
        console.log(response.status)
        this.setState({ loader: false })

        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Home' })
          ]
        })
        this.props.navigation.dispatch(resetAction)

        Alert.alert('Registrasi berhasil', `Silahkan cek email anda ${this.state.email} untuk verifikasi email`, [])
      })
      .catch(error => {
        this.setState({ loader: false })
        if (error.response) {
          ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
        }
        else {
          ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
        }
      })
  }


  regexEmail = (email) => {
    const validate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validate.test(email);
  };

  regexPhoneNumber = (phone) => {
    const validate = /^\d+$/;
    return validate.test(phone);
  }

  register = () => {
    Keyboard.dismiss()
    console.log(this.state, 'STATE');
    const {
      name,
      email,
      username,
      password,
      repassword,
      phone,
      organization,
      organizationType,
      idNumber,
      address,
      idPhoto,
      profilePhoto,
      npwpPhoto,
      npwp
    } = this.state;

    switch (name) {
      case '':
        return ToastAndroid.show('Nama Lengkap Tidak Boleh Kosong', ToastAndroid.SHORT);
      default:
        console.log('Nama Lengkap Tidak Kosong');
        if (name.length <= 3) {
          return ToastAndroid.show('Nama Lengkap minimal 4 huruf.', ToastAndroid.SHORT);
        }
        switch (password) {
          case '':
            return ToastAndroid.show('Password Tidak Boleh Kosong', ToastAndroid.SHORT);
          default:
            console.log('Password Tidak Kosong');
            if (password.length <= 5) {
              return ToastAndroid.show('Password minimal 6 digit.', ToastAndroid.SHORT);
            }
            switch (repassword) {
              case '':
                return ToastAndroid.show('Konfirmasi Password Tidak Boleh Kosong', ToastAndroid.SHORT);
              default:
                console.log('Konfirmasi Password Tidak Kosong');
                console.log(repassword, password);
                if (repassword.length <= 5) {
                  return ToastAndroid.show('Konfirmasi Password minimal 6 digit.', ToastAndroid.SHORT);
                }
                if (repassword !== password) {
                  return ToastAndroid.show('Konfirmasi Password Tidak Sama.', ToastAndroid.SHORT);
                }
                switch (email) {
                  case '':
                    return ToastAndroid.show('Email Tidak Boleh Kosong', ToastAndroid.SHORT);
                  default:
                    console.log('Email Tidak Kosong');
                    if (email) {
                      if (!this.regexEmail(email)) {
                        return ToastAndroid.show('Format Email Salah', ToastAndroid.SHORT);
                      }
                      switch (username) {
                        case '':
                          return ToastAndroid.show('Username Tidak Boleh Kosong', ToastAndroid.SHORT);
                        default:
                          console.log('Username Tidak Kosong');
                          if (username.length <= 3) {
                            return ToastAndroid.show('Username minimal 4 huruf', ToastAndroid.SHORT);
                          }
                          switch (phone) {
                            case '':
                              return ToastAndroid.show('No. Telepon Tidak Boleh Kosong', ToastAndroid.SHORT);
                            default:
                              console.log('Nomor Telepon Tidak Kosong');
                              if (phone) {
                                if (!this.regexPhoneNumber(phone)) {
                                  return ToastAndroid.show('Format No Telepon Salah', ToastAndroid.SHORT);
                                }
                                switch (organization) {
                                  case '':
                                    return ToastAndroid.show('Nama Lembaga Tidak Boleh Kosong', ToastAndroid.SHORT);
                                  default:
                                    console.log('Nama Lembaga Tidak Kosong');
                                    if (organization.length <= 3) {
                                      return ToastAndroid.show('Nama Lembaga minimal 4 Huruf', ToastAndroid.SHORT);
                                    }
                                    switch (organizationType) {
                                      case '':
                                        return ToastAndroid.show('Jenis Lembaga Tidak Boleh Kosong', ToastAndroid.SHORT);
                                      default:
                                        console.log('Jenis Lembaga Tidak Kosong');
                                        switch (idNumber) {
                                          case '':
                                            return ToastAndroid.show('Nomor KTP Tidak Boleh Kosong', ToastAndroid.SHORT);
                                          default:
                                            console.log('No KTP Tidak Kosong');
                                            if (idNumber.length !== 16) {
                                              return ToastAndroid.show('Nomor KTP harus 16 digit', ToastAndroid.SHORT);
                                            }
                                            switch (address) {
                                              case '':
                                                return ToastAndroid.show('Alamat Tidak Boleh Kosong', ToastAndroid.SHORT);
                                              default:
                                                console.log('Alamat Tidak Kosong');
                                                if (address.length <= 3) {
                                                  return ToastAndroid.show('Alamat minimal 4 Huruf', ToastAndroid.SHORT);
                                                }
                                                switch (idPhoto) {
                                                  case '':
                                                    return ToastAndroid.show('Foto KTP Tidak Boleh Kosong', ToastAndroid.SHORT);
                                                  case null:
                                                    return ToastAndroid.show('Foto KTP Tidak Boleh Kosong', ToastAndroid.SHORT);
                                                  default:
                                                    console.log('KTP TIdak Kosong');
                                                    switch (npwp) {
                                                      case '':
                                                        return ToastAndroid.show('Nomor NPWP Tidak Boleh Kosong', ToastAndroid.SHORT);
                                                      default:
                                                        console.log('No NPWP Tidak Kosong');
                                                        if (npwp.length !== 15) {
                                                          return ToastAndroid.show('Nomor NPWP harus 15 Digit', ToastAndroid.SHORT);
                                                        }
                                                        switch (profilePhoto) {
                                                          case '':
                                                            return ToastAndroid.show('Foto Profil Tidak Boleh Kosong', ToastAndroid.SHORT);
                                                          case null:
                                                            return ToastAndroid.show('Foto Profil Tidak Boleh Kosong', ToastAndroid.SHORT);
                                                          default:
                                                            console.log('Foto Profil Tidak Kosong');
                                                            switch (npwpPhoto) {
                                                              case '':
                                                                return ToastAndroid.show('Foto NPWP Tidak Boleh Kosong', ToastAndroid.SHORT);
                                                              case null:
                                                                return ToastAndroid.show('Foto NPWP Tidak Boleh Kosong', ToastAndroid.SHORT);
                                                              default:
                                                                console.log('Foto NPWP Tidak Kosong');
                                                                return this.onRegister();
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
                }
            }
        }
    }
  }


  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };


  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };


  selectPhotoTappedNPWP() {
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
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          npwpPhoto: source,
          pathNpwp: source
        });
      }
    });
  }

  selectPhotoTappedKTP() {
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
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          idPhoto: source,
          pathKtp: source
        });
      }
    });
  }


  selectPhotoTappedProfile() {
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
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          profilePhoto: source,
          pathProfile: source
        });
      }
    });
  }

  renderPickerCity = () => {
    if (this.state.dataCity === '') {
      return <Picker.Item label='Pilih Kota' value='0' />
    }
    const resultRender = this.state.dataCity;
    return resultRender.map((data, index) => {
      return <Picker.Item label={data.name} value={data.id} key={index} />
    })
  }

  renderButton = () => {
    if (this.state.loader) {
      return <Spinner size='large' />
    }

    return (
      <Button
        onPress={
          () => Alert.alert(
            '',
            'Yakin data anda sudah benar ?',
            [
              { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              { text: 'Ya', onPress: () => this.register() },
            ]
          )
        }
      >
        Daftar
      </Button>
    )
  }

  render() {
    const {
      organization,
      organizationType,
      addressInstitution,
      npwp,
      email,

      name,
      idNumber,
      address,
      phone,
      username,
      password,
      repassword,
      idCity
    } = this.state

    if (this.state.loading) {
      return <Spinner size='large' />
    }


    return (
      <View>
        <ScrollView
          style={styles.containerStyle}
          keyboardShouldPersistTaps="always"
        >
          <Container>
            <ContainerSection>
              <Text style={styles.headerStyle}>
                Informasi Lembaga
              </Text>
            </ContainerSection>
            <ContainerSection>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerTextStyle}>Jenis Lembaga</Text>
                <View style={styles.pickerStyle}>
                  <Picker
                    selectedValue={organizationType}
                    onValueChange={v => this.onChangeInput('organizationType', v)}
                  >
                    <Picker.Item label='Pilih Jenis Lembaga' value='0' />
                    <Picker.Item label='PT' value='PT' />
                    <Picker.Item label='CV' value='CV' />
                    <Picker.Item label='Lainnya' value='Lainnya' />
                  </Picker>
                </View>
              </View>
            </ContainerSection>
            <ContainerSection>
              <Input
                label='Nama Lembaga'
                value={organization}
                onChangeText={v => this.onChangeInput('organization', v)}
              />
            </ContainerSection>
            <ContainerSection>
              <Input
                label='NPWP (Nomor Pokok Wajib Pajak)'
                value={npwp}
                keyboardType="numeric"
                onChangeText={v => this.onChangeInput('npwp', v)}
              />
            </ContainerSection>

            <Text style={[styles.pickerTextStyle, { marginLeft: 5, marginTop: 10 }]}>Unggah Foto NPWP</Text>
            <ContainerSection>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={this.selectPhotoTappedNPWP.bind(this)}>
                  <View>
                    {this.state.pathNpwp === null ?
                      <Image
                        source={require('../assets/images/ic_add_a_photo.png')}
                      />
                      :
                      <Image style={{ height: 200, width: 300 }} source={this.state.pathNpwp} />
                    }
                  </View>
                </TouchableOpacity>
              </View>
            </ContainerSection>
            <ContainerSection>
              <Input
                label='Alamat'
                value={addressInstitution}
                onChangeText={v => this.onChangeInput('addressInstitution', v)}
              />
            </ContainerSection>
          </Container>

          <Container>
            <ContainerSection>
              <Text style={styles.headerStyle}>
                Informasi Personal
              </Text>
            </ContainerSection>

            <Text style={[styles.pickerTextStyle, { marginLeft: 5, marginTop: 10 }]}>Unggah Foto Profile</Text>
            <ContainerSection>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={this.selectPhotoTappedProfile.bind(this)}>
                  <View>
                    {this.state.pathProfile === null ?
                      <Image
                        source={require('../assets/images/ic_add_a_photo.png')}
                      />
                      :
                      <Image
                        style={{ height: 200, width: 300 }}
                        source={this.state.pathProfile}
                      />
                    }
                  </View>
                </TouchableOpacity>
              </View>
            </ContainerSection>

            <ContainerSection>
              <Input
                label='Nama Lengkap'
                placeholder='contoh: Ahmad Darudi'
                value={name}
                onChangeText={v => this.onChangeInput('name', v)}
              />
            </ContainerSection>
            <ContainerSection>
              <Input
                label='No. KTP (Kartu Tanda Penduduk)'
                placeholder='1050304562356723'
                keyboardType="numeric"
                value={idNumber}
                onChangeText={v => this.onChangeInput('idNumber', v)}
              />
            </ContainerSection>

            <Text style={[styles.pickerTextStyle, { marginLeft: 5, marginTop: 10 }]}>Unggah Foto KTP</Text>
            <ContainerSection>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={this.selectPhotoTappedKTP.bind(this)}>
                  <View>
                    {this.state.pathKtp === null ?
                      <Image
                        source={require('../assets/images/ic_add_a_photo.png')}
                      />
                      :
                      <Image
                        style={{ height: 200, width: 300 }}
                        source={this.state.pathKtp}
                      />
                    }
                  </View>
                </TouchableOpacity>
              </View>
            </ContainerSection>
            <ContainerSection>
              <Input
                label='Alamat'
                value={address}
                onChangeText={v => this.onChangeInput('address', v)}
              />
            </ContainerSection>
            <ContainerSection>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerTextStyle}>Kota</Text>
                <View style={styles.pickerStyle}>
                  <Picker
                    selectedValue={idCity}
                    onValueChange={v => this.onChangeInput('idCity', v)}
                  >
                    {this.renderPickerCity()}
                  </Picker>
                </View>
              </View>
            </ContainerSection>
            <ContainerSection>
              <Input
                label='No. Telepon/Handphone'
                placeholder='contoh: 085219100674'
                keyboardType="numeric"
                value={phone}
                onChangeText={v => this.onChangeInput('phone', v)}
              />
            </ContainerSection>
            <ContainerSection>
              <Input
                label='Email'
                value={email}
                onChangeText={v => this.onChangeInput('email', v)}
              />
            </ContainerSection>
          </Container>

          <Container>
            <ContainerSection>
              <Text style={styles.headerStyle}>
                Data Akun
              </Text>
            </ContainerSection>

            <ContainerSection>
              <Input
                label='Username'
                placeholder='contoh: esta'
                value={username}
                onChangeText={v => this.onChangeInput('username', v)}
              />
            </ContainerSection>
            <ContainerSection>
              <Input
                label='Password'
                placeholder='minimal 6 karakter'
                value={password}
                onChangeText={v => this.onChangeInput('password', v)}
                secureTextEntry
              />
            </ContainerSection>
            <ContainerSection>
              <Input
                label='Konfirmasi Password'
                placeholder='minimal 6 karakter'
                secureTextEntry
                value={repassword}
                onChangeText={v => this.onChangeInput('repassword', v)}
              />
            </ContainerSection>

            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <ContainerSection>
                {this.renderButton()}
              </ContainerSection>
            </View>
          </Container>

        </ScrollView>
      </View>
    )
  }
}

const styles = {
  headerStyle: {
    color: COLOR.secondary_a,
    fontSize: 18
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
  avatar: {
    borderRadius: 75,
    width: 100,
    height: 100
  }
}

export default RegistrationFormPage;
