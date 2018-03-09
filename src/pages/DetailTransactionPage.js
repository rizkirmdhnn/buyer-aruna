import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  AsyncStorage,
  TouchableWithoutFeedback,
  ToastAndroid,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import moment from 'moment';
import numeral from 'numeral';
import axios from 'axios';
import { CheckBox, Rating } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { Card, Button, ContainerSection, Spinner, Input } from '../components/common'
import { BASE_URL, COLOR } from './../shared/lb.config';

class DetailTransactionPage extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `No. PO ${navigation.state.params.datas.Request.codeNumber}`,
    headerLeft:
      <TouchableOpacity
        onPress={() => { navigation.navigate('Home', { screenDefault: 'TransactionPage' }) }}
      >
        <Image
          style={{ width: 20, height: 20, marginLeft: 30 }}
          source={require('./../assets/images/back.png')}
        />
      </TouchableOpacity>,
    headerRight:
      <TouchableOpacity
        onPress={() => { navigation.navigate('Message', { idData: navigation.state.params.datas }) }}
      >
        <View>
          <Image
            style={{ height: 20, width: 20, margin: 20 }}
            source={require('../assets/images/ic_diskusi_alt_white.png')}
          />
        </View>
      </TouchableOpacity>,
    headerTitleStyle: {
      alignSelf: 'center',
      fontSize: 14
    }
  });

  constructor(props) {
    super(props)

    this.state = {
      dataSampleSurvey: [],
      refreshing: true,
      dataMaster: '',
      dataTransaction: '',
      dataDetail: '',
      photo: '',
      tokenUser: '',
      survey: false,
      sample: false,
      dataSurvey: 0,
      dataSample: 0,

      loader: null,
      checked: false,
      isModalVisible: false,

      requestContainer: null,
      requestContainerApprove: null,
      requestContainerRejected: null,
      requestContainerWaiting: null,
      requestContainerLate: null,

      contractDone: null,
      contractNotDone: null,
      contractRevision: null,
      contractApproved: null,
      contractPending: null,

      depositContainer: null,
      depositPending: null,
      depositApproved: null,
      depositFailed: null,
      depositNotYet: null,

      collectionContainer: null,
      collectionExpanded: null,
      collectionNotYet: null,
      collectionPending: null,
      collectionApproved: null,
      collectionRejected: null,


      productionContainer: null,
      productionExpanded: null,
      productionNotYet: null,
      productionPending: null,
      productionApproved: null,
      productionRejected: null,


      shippingContainer: null,
      shippingExpanded: null,
      shippingNotYet: null,
      shippingPending: null,
      shippingApproved: null,
      shippingRevision: null,

      deliveryContainer: null,
      deliveryNotYet: null,
      deliveryPending: null,
      deliveryRevision: null,
      deliveryApproved: null,
      deliveryApprovedAdminPending: null,
      deliveryApprovedAdminRevision: null,

      doneContainer: null,

      requestExpanded: false,
      contractExpanded: false,
      depositExpanded: false,
      deliveryExpanded: false,
      paidExpanded: false,
      doneExpanded: false,


      reviewKomentar: ''
    }
  }

  componentWillMount() {
    this.setState({ dataMaster: this.props.navigation.state.params.datas });
    return this.getData();
  }

  onChangeInput = (name, v) => {
    this.setState({ [name]: v })
  }

  onRefresh() {
    this.setState({
      refreshing: true
    }, () => {
      this.getData();
    });
  }

  getData() {
    const idTransaction = this.props.navigation.state.params.datas.id;
    AsyncStorage.getItem('loginCredential', (err, result) => {
      const token = result;
      this.setState({ tokenUser: token })
      axios.get(`${BASE_URL}/buyer/orders/${idTransaction}`, {
        headers: { token }
      })
        .then(response => {
          console.log(response, 'Data Transaction');
          this.setState({ dataTransaction: response.data.data, dataDetail: response.data.data, refreshing: false });
          console.log(this.state.dataMaster, 'DATA MASTER');
          console.log(this.state.dataTransaction, 'DATA TRANSACTION');

          this.logicFirst();
          this.logicSecond();
        })
        .catch(error => {
          console.log(error, 'error');
          // if (error.response) {
          //     alert(error.response.data.message)
          // }
          // else {
          //     alert('Koneksi internet bermasalah Get All Data')
          // }
          this.setState({ refreshing: false })
        })
    });
  }


  logicSecond() {
    console.log('LOGIC 2 FIRE');
    //=================================================== LOGIC SECOND CONTAINER BOS ============================================
    const { dataTransaction } = this.state;
    const SAMPLE = dataTransaction.Sample;
    const CONTRACT = dataTransaction.ContractId;
    const DEPOSIT = dataTransaction.deposit;
    const COLLECTION = dataTransaction.collection;
    const PRODUCTION = dataTransaction.production;
    const SHIPPING = dataTransaction.shipping;
    const DELIVERY = dataTransaction.shippingDelivered;

    if (CONTRACT === null) {
      return this.setState({ contractNotDone: true })
    }
    const IDCONTRACT = dataTransaction.Contract.Status.id;
    console.log(IDCONTRACT, 'ID CONTRACT');

    switch (IDCONTRACT) {
      case 4:
        this.setState({ requestContainer: false, contractDone: true, contractPending: true });
        if (SAMPLE === null) {
          this.setState({ requestContainerLate: true })
        }
        break;
      case 5:
        this.setState({ requestContainer: false, contractDone: true, contractApproved: true, depositContainer: true });
        {
          if (SAMPLE === null) {
            this.setState({ requestContainerLate: true })
          }

          if (DEPOSIT === null) {
            return this.setState({ depositNotYet: true })
          }

          const IDDEPOSIT = dataTransaction.deposit.Status.id;
          console.log(IDDEPOSIT, 'ID DEPOSIT');

          switch (IDDEPOSIT) {
            case 50:
              return this.setState({ depositPending: true });
            case 51:
              this.setState({ depositApproved: true, collectionContainer: true });
              {
                if (COLLECTION === null) {
                  return this.setState({ collectionNotYet: true });
                }

                const IDCOLLECTION = dataTransaction.collection.Status.id;
                switch (IDCOLLECTION) {
                  case 41:
                    return this.setState({ collectionPending: true });
                  case 42:
                    this.setState({ collectionApproved: true, productionContainer: true });
                    {
                      if (PRODUCTION === null) {
                        return this.setState({ productionNotYet: true });
                      }

                      const IDPRODUCTION = dataTransaction.production.Status.id;
                      switch (IDPRODUCTION) {
                        case 44:
                          return this.setState({ productionPending: true });
                        case 45:
                          this.setState({ productionApproved: true, shippingContainer: true });
                          {
                            if (SHIPPING === null) {
                              return this.setState({ shippingNotYet: true });
                            }
                            const IDSHIPPING = dataTransaction.shipping.Status.id;
                            switch (IDSHIPPING) {
                              case 28:
                                return this.setState({ shippingNotYet: true });
                              case 29:
                                this.setState({ shippingApproved: true, deliveryContainer: true });
                                {
                                  if (DELIVERY === null) {
                                    return this.setState({ deliveryNotYet: true });
                                  }

                                  const IDDELIVERY = dataTransaction.shippingDelivered.Status.id;
                                  switch (IDDELIVERY) {
                                    case 35:
                                      return this.setState({ deliveryPending: true });
                                    case 36:
                                      return this.setState({ deliveryApproved: true, doneContainer: true, doneExpanded: true });
                                    default:
                                      return this.setState({ deliveryRevision: true });
                                  }
                                }
                              default:
                                return this.setState({ shippingRevision: true });
                            }
                          }
                        default:
                          return this.setState({ productionRejected: true });
                      }
                    }
                  default:
                    return this.setState({ collectionRejected: true });
                }
              }
            default:
              return this.setState({ depositFailed: true });
          }
        }
      default:
        this.setState({ requestContainer: false, contractDone: true, contractRevision: true })
        if (SAMPLE === null) {
          this.setState({ requestContainerLate: true })
        }
    }

    //=================================================== END LOGIC SECOND CONTAINER BOS ========================================
  }


  logicFirst() {
    console.log('LOGIC 1 FIRE');
    const { dataTransaction, dataSampleSurvey } = this.state;
    const SAMPLE = dataTransaction.Sample;
    console.log(SAMPLE, 'SAMPLE');

    //=================================================== LOGIC FIRST CONTAINER BOS ============================================
    if (SAMPLE === null) {
      return this.setState({ requestContainer: true })
    }
    if (SAMPLE.sample === true) {
      this.setState({ dataSampleSurvey: [...dataSampleSurvey, 'Sample'] })
    }
    if (SAMPLE.survey === true) {
      this.setState({ dataSampleSurvey: [...dataSampleSurvey, 'Survey'] })
    }
    console.log(this.state.dataSampleSurvey, 'SURVEYYYYYYYYYYYYYYYYYYYYYY');
    const IDSAMPLE = dataTransaction.Sample.StatusId;
    console.log(IDSAMPLE, 'IDSAMPLE');
    switch (IDSAMPLE) {
      case 16:
        return this.setState({ requestContainerWaiting: true })
      case 17:
        return this.setState({ requestContainerApprove: true, requestContainerLate: false })
      default:
        return this.setState({ requestContainerRejected: true })
    }
    //=================================================== END LOGIC FIRST CONTAINER BOS ========================================
  }

  isGoDiscuss() {
    console.log(this.state.dataMaster, 'Data discuss');
  }

  createContract() {
    this.props.navigation.navigate('FormContract', { datas: this.props.navigation.state.params.datas })
  }

  createContractRevision() {
    this.props.navigation.navigate('FormContractRevision', { datas: this.props.navigation.state.params.datas })
  }


  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }

  checkBoxSample = () => {
    this.setState({ sample: !this.state.sample });
  }

  checkBoxSurvey = () => {
    this.setState({ survey: !this.state.survey });
  }

  sendRequest() {
    AsyncStorage.getItem('loginCredential', (err, result) => {
      const token = result;
      const id = this.state.dataMaster.id;

      const dataRequest = {
        survey: this.state.survey === true ? 1 : 0,
        sample: this.state.sample === true ? 1 : 0
      }

      axios.post(`${BASE_URL}/buyer/orders/${id}/samples`,
        dataRequest
        , {
          headers: {
            token
          },
        })
        .then(response => {
          console.log(response, 'Result')
          ToastAndroid.show('Sukses Request permintaan Survei & Sample.', ToastAndroid.SHORT)
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'DetailTransaction',
                params: { datas: this.state.dataMaster }
              })
            ]
          })
          this.props.navigation.dispatch(resetAction)
        })
        .catch(error => {
          console.log(error, 'Error');
          if (error.response) {
            alert(error.response.data.message)
          }
          else {
            alert('Koneksi internet bermasalah Sample')
          }
        })
    });
  }

  uploadDeposit() {
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

        this.setState({
          photo: source.uri,
          loader: true
        });

        const id = this.state.dataMaster.id;
        console.log(id, 'id nya');
        const dataPhoto = new FormData();
        dataPhoto.append('photo', {
          uri: this.state.photo,
          type: 'image/jpeg',
          name: 'deposit.jpeg'
        });

        axios.post(`${BASE_URL}/buyer/orders/${id}/deposits`,
          dataPhoto,
          {
            headers: {
              token: this.state.tokenUser,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(result => {
            console.log(result, 'Upload Payment');
            this.setState({ loader: false })
            ToastAndroid.show('Bukti Deposit Sukses Diupload.', ToastAndroid.SHORT)
            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'DetailTransaction',
                  params: { datas: this.state.dataMaster }
                })
              ]
            })
            this.props.navigation.dispatch(resetAction)
          })
          .catch(error => {
            console.log(error);
            if (error.response) {
              alert(error.response.data.message)
            }
            else {
              alert('Koneksi internet bermasalah')
            }
            this.setState({ refreshing: false })
          })
      }
    });
  }

  uploadReceiving() {
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

        this.setState({
          photo: source.uri,
          loader: true
        });

        const id = this.state.dataMaster.id;
        console.log(id, 'id nya');
        const dataPhoto = new FormData();
        dataPhoto.append('photo', {
          uri: this.state.photo,
          type: 'image/jpeg',
          name: 'receivingKomoditas.jpeg'
        });

        axios.post(`${BASE_URL}/buyer/orders/${id}/shippingsdelivered`,
          dataPhoto,
          {
            headers: {
              token: this.state.tokenUser,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(result => {
            console.log('AIOSAIODAODISODIAD');
            console.log(result, 'Upload Payment');
            this.setState({
              loader: true
            });
            ToastAndroid.show('Upload Bukti Penerimaan Sukses.', ToastAndroid.SHORT)
            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'DetailTransaction',
                  params: { datas: this.state.dataMaster }
                })
              ]
            })
            this.props.navigation.dispatch(resetAction)
          })
          .catch(error => {
            console.log(error);
            if (error.response) {
              alert(error.response.data.message)
            }
            else {
              alert('Koneksi internet bermasalah')
            }
            this.setState({ loader: false })
          })
      }
    });
  }

  uploadReceivingRevision() {
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

        this.setState({
          photo: source.uri,
          loader: true
        });

        const id = this.state.dataMaster.id;
        console.log(id, 'id nya');
        const dataPhoto = new FormData();
        dataPhoto.append('photo', {
          uri: this.state.photo,
          type: 'image/jpeg',
          name: 'receivingKomoditasRevision.jpeg'
        });

        axios.put(`${BASE_URL}/buyer/orders/${id}/shippingsdelivered`,
          dataPhoto,
          {
            headers: {
              token: this.state.tokenUser,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(result => {
            console.log('AIOSAIODAODISODIAD');
            console.log(result, 'Upload Payment');
            this.setState({
              loader: true
            });
            ToastAndroid.show('Upload Bukti Revisi Penerimaan Sukses.', ToastAndroid.SHORT)
            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'DetailTransaction',
                  params: { datas: this.state.dataMaster }
                })
              ]
            })
            this.props.navigation.dispatch(resetAction)
          })
          .catch(error => {
            console.log(error);
            if (error.response) {
              alert(error.response.data.message)
            }
            else {
              alert('Koneksi internet bermasalah Revision')
            }
            this.setState({ loader: false })
          })
      }
    });
  }


  giveComment() {
    console.log(this.state.reviewKomentar, 'data')
    const idOrder = this.state.dataTransaction.id;
    this.setState({ loader: true });
    const dataReviews = {
      rating: 4,
      comment: this.state.reviewKomentar
    }
    console.log(idOrder, '', dataReviews)
    AsyncStorage.getItem('loginCredential', (err, result) => {
      const token = result;
      console.log(token, 'Token');
      axios.post(`${BASE_URL}/buyer/orders/${idOrder}/reviews`, dataReviews, {
        headers: {
          token,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log(response, 'sukses');
          ToastAndroid.show('Sukses Me-review Nelayan.', ToastAndroid.SHORT)
          this.setState({ loader: false });
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'DetailTransaction',
                params: { datas: this.state.dataMaster }
              })
            ]
          })
          this.props.navigation.dispatch(resetAction)
        })
        .catch(error => {
          this.setState({ loader: false });
          alert('Admin Belum Melakukan Pelunasan. Silahkan Tunggu Pelunasan oleh admin');
          console.log('Failed');
          console.log(error.response, 'Error')
        });
    });
  }


  render() {
    const {
      survey,
      sample,

      requestExpanded,
      requestContainer,
      requestContainerApprove,
      requestContainerRejected,
      requestContainerWaiting,
      requestContainerLate,

      contractExpanded,
      contractDone,
      contractNotDone,
      contractRevision,
      contractApproved,
      contractPending,

      depositExpanded,
      depositContainer,
      depositPending,
      depositApproved,
      depositFailed,
      depositNotYet,


      collectionContainer,
      collectionExpanded,
      collectionNotYet,
      collectionPending,
      collectionApproved,
      collectionRejected,


      productionContainer,
      productionExpanded,
      productionNotYet,
      productionPending,
      productionApproved,
      productionRejected,

      shippingContainer,
      shippingExpanded,
      shippingNotYet,
      shippingPending,
      shippingApproved,
      shippingRevision,

      deliveryExpanded,
      deliveryContainer,
      deliveryNotYet,
      deliveryPending,
      deliveryRevision,
      deliveryApproved,

      doneExpanded,
      doneContainer,


      reviewKomentar,
      loader,
      dataTransaction,
      dataSampleSurvey
    } = this.state

    return (
      <ScrollView
        style={{ flex: 1, padding: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        <ContainerSection>
          <View style={{ flexDirection: 'column', flex: 1, marginLeft: 10, marginRight: 10 }}>
            <Image
              style={styles.thumbnailStyle}
              source={{ uri: `${BASE_URL}/images/${this.state.dataMaster.Request.Transaction.photo}` }}
            />
          </View>
          <View style={{ justifyContent: 'space-around', flex: 2 }}>
            <Text style={styles.buyerName}>{this.state.dataMaster.Request.Transaction.Fish.name}</Text>
            <Text style={styles.buyerName}>{numeral(this.state.dataMaster.Request.Transaction.quantity).format('0,0')} Kg</Text>
            <Text>Rp {numeral(this.state.dataMaster.Request.Transaction.minBudget).format('0,0')} - {numeral(this.state.dataMaster.Request.Transaction.maxBudget).format('0,0')},-/Kg</Text>
            <Text>{this.state.dataMaster.Request.Supplier.organizationType} {this.state.dataMaster.Request.Supplier.organization}</Text>
          </View>
        </ContainerSection>

        <Card style={{ borderBottomWidth: 1, borderColor: '#eaeaea' }}>
          <View style={styles.card}>
            <ContainerSection>
              <TouchableWithoutFeedback onPress={() => { this.setState({ requestExpanded: !requestExpanded }); console.log(this.state.requestExpanded, 'Request Klik') }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 20 }}>Survey & Sample</Text>
                  <View style={{ flex: 1 }}>
                    <Icon size={30} style={{ alignSelf: 'flex-end' }} name={requestExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ContainerSection>
            {
              requestExpanded ?
                <ContainerSection>
                  {
                    requestContainer ?
                      <View style={{ flexDirection: 'column' }}>
                        <View>
                          <Text style={{ textAlign: 'center' }}>Apakah anda ingin melakukan permintaan sample atau survei nelayan?</Text>
                        </View>
                        <View style={{ paddingTop: 10 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <CheckBox
                              title='Survei'
                              checked={survey}
                              onPress={() => this.checkBoxSurvey()}
                            />
                            <CheckBox
                              title='Sample'
                              checked={sample}
                              onPress={() => this.checkBoxSample()}
                            />
                          </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <Button onPress={() => { this.sendRequest() }}>
                            Kirim Permintaan
                        </Button>
                        </View>
                      </View>
                      :
                      <View />
                  }

                  {
                    requestContainerWaiting ?
                      <View style={{ flexDirection: 'column' }}>
                        <View>
                          <Text>Anda sudah melakukan permintaan, silahkan tunggu persetujuan Nelayan </Text>
                        </View>
                      </View>
                      :
                      <View />
                  }

                  {
                    requestContainerApprove ?
                      <View style={{ flexDirection: 'column' }}>
                        <View>
                          <Text style={{ textAlign: 'center' }}>Permintaan {dataSampleSurvey} anda telah disetujui.</Text>
                        </View>
                      </View>
                      :
                      <View />
                  }
                  {
                    requestContainerRejected ?
                      <View style={{ flexDirection: 'column' }}>
                        <View>
                          <Text>Permintaan anda telah ditolak.</Text>
                        </View>
                      </View>
                      :
                      <View />
                  }
                  {
                    requestContainerLate ?
                      <View style={{ flexDirection: 'column' }}>
                        <View>
                          <Text>Anda sudah membuat kontrak. Tidak dapat melakukan permintaan sample dan request </Text>
                        </View>
                      </View>
                      :
                      <View />
                  }
                </ContainerSection>

                :
                <View />
            }
          </View>

          <View style={styles.card}>
            <ContainerSection>
              <TouchableWithoutFeedback onPress={() => this.setState({ contractExpanded: !contractExpanded })}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ flex: 1, fontSize: 20 }}>Kontrak</Text>
                  <View style={{ flex: 1 }}>
                    <Icon size={30} style={{ alignSelf: 'flex-end' }} name={contractExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ContainerSection>
            {
              contractExpanded ?
                <ContainerSection>
                  <View style={{ flexDirection: 'column', flex: 1 }}>
                    {
                      contractNotDone ?
                        <View style={{ flexDirection: 'column' }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ textAlign: 'left' }}>Silahkan anda membuat kontrak.</Text>
                            <Text style={{ textAlign: 'left' }}>Lakukan diskusi untuk mempercepat transaksi.</Text>
                          </View>
                          <View style={{ height: 20 }} />
                          <View style={{ marginTop: 10, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                              <Button onPress={() => { this.createContract() }}>
                                Buat Kontrak
                            </Button>
                            </View>
                          </View>
                        </View>
                        :
                        <View />
                    }
                    {
                      contractDone ?
                        <View style={{ flexDirection: 'column' }}>
                          {
                            contractPending ?
                              <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                  <Text>Status</Text>
                                  <Text>File</Text>
                                  <Text>Keterangan</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                  <Text>{this.state.dataTransaction.Contract.Status.name}</Text>
                                  <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/files/${this.state.dataTransaction.Contract.file}`).catch(err => console.error('An error occurred', err))}>
                                    <View style={{ flexDirection: 'row' }}>
                                      <Text style={{ color: COLOR.secondary_a }}>File Kontrak.pdf</Text>
                                      <Icon size={20} style={{ color: COLOR.secondary_a, marginLeft: 5 }} name="md-download" />
                                    </View>
                                  </TouchableOpacity>
                                  <Text>Anda sudah mengisi formulir kontrak. Tunggu Nelayan Menyetujui. Lakukan diskusi untuk mempercepat transaksi.</Text>
                                </View>
                              </View>
                              :
                              <View />
                          }
                          {
                            contractRevision ?
                              <View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                  <View style={{ flex: 1 }}>
                                    <Text>Status</Text>
                                    <Text>File</Text>
                                    <Text>Keterangan</Text>
                                  </View>
                                  <View style={{ flex: 1 }}>
                                    <Text style={{ textAlign: 'left' }}>{this.state.dataTransaction.Contract.Status.name}</Text>
                                    <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/files/${this.state.dataTransaction.Contract.file}`).catch(err => console.error('An error occurred', err))}>
                                      <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: COLOR.secondary_a }}>File Kontrak.pdf</Text>
                                        <Icon size={20} style={{ color: COLOR.secondary_a, marginLeft: 5 }} name="md-download" />
                                      </View>
                                    </TouchableOpacity>
                                    <Text style={{ textAlign: 'left' }}>Nelayan meminta kontrak anda di revisi. Silahkan Ubah kontrak anda</Text>
                                  </View>
                                </View>

                                <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                  <View style={{ flex: 1 }}>
                                    <Button onPress={() => { this.createContractRevision() }}>
                                      Revisi Kontrak
                                </Button>
                                  </View>
                                </View>
                              </View>
                              :
                              <View />
                          }
                          {
                            contractApproved ?
                              <View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                  <View style={{ flex: 1 }}>
                                    <Text>Status</Text>
                                    <Text>File</Text>
                                    <Text>Keterangan</Text>
                                  </View>
                                  <View style={{ flex: 1 }}>
                                    <Text style={{ textAlign: 'left' }}>Disetujui</Text>
                                    <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/files/${this.state.dataTransaction.Contract.file}`).catch(err => console.error('An error occurred', err))}>
                                      <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'blue' }}>File Kontrak.pdf</Text>
                                        <Icon size={20} style={{ color: 'blue', marginLeft: 5 }} name="md-download" />
                                      </View>
                                    </TouchableOpacity>
                                    <Text style={{ textAlign: 'left' }}>Kontrak anda telah disetujui Nelayan.</Text>
                                  </View>
                                </View>
                              </View>
                              :
                              <View />
                          }
                        </View>
                        :
                        <View />
                    }
                  </View>
                </ContainerSection>
                :
                <View />
            }
          </View>

          {
            depositContainer ?
              <View style={styles.card}>
                <ContainerSection>
                  {
                    depositContainer ?
                      <TouchableWithoutFeedback onPress={() => this.setState({ depositExpanded: !depositExpanded })}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <Text style={{ fontSize: 20 }}>Deposit</Text>
                          <View style={{ flex: 1 }}>
                            <Icon size={30} style={{ alignSelf: 'flex-end' }} name={depositExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                      :
                      <View />
                  }
                </ContainerSection>
                {
                  depositExpanded ?
                    <ContainerSection>
                      {
                        depositNotYet ?
                          <View style={{ flexDirection: 'column', flex: 1 }}>
                            <View>
                              <Text>Kontrak anda telah disetujui</Text>
                              <Text>Silahkan lakukan deposit sebesar Rp. {numeral(dataTransaction.Contract.totalPrice).format('0,0')}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              {
                                loader ?
                                  <View>
                                    <Spinner size='large' />
                                  </View>
                                  :
                                  <View style={{ marginTop: 30 }}>
                                    <Button onPress={() => { this.uploadDeposit() }}>
                                      Unggah Bukti Deposit
                                    </Button>
                                  </View>
                              }
                            </View>
                          </View>

                          :
                          <View />
                      }
                      {
                        depositPending ?

                          <View style={{ flexDirection: 'column', flex: 1 }}>
                            <View>
                              <Text>Total Pembayaran Deposit Rp {numeral(dataTransaction.Contract.totalPrice).format('0,0')}</Text>
                              <Text>Status: Menunggu Verifikasi Admin</Text>
                            </View>
                          </View>

                          :
                          <View />
                      }
                      {
                        depositFailed ?
                          <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                              <View style={{ flex: 1 }}>
                                <Text>Status</Text>
                                <Text>Keterangan</Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text>Deposit Ditolak</Text>
                                <Text>Silahkan upload bukti deposit yang benar.</Text>
                              </View>
                            </View>

                            <View style={{ marginTop: 10, flexDirection: 'row' }}>
                              <Button onPress={() => { this.uploadDeposit() }}>
                                Unggah Ulang Bukti Deposit
                              </Button>
                            </View>
                          </View>
                          :
                          <View />
                      }
                      {
                        depositApproved ?

                          <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 1 }}>
                              <Text>Total Biaya</Text>
                              <Text>Tanggal Approved</Text>
                              <Text>Status</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={{ textAlign: 'left' }}>Rp. {numeral(dataTransaction.Contract.totalPrice).format('0,0')}</Text>
                              <Text style={{ textAlign: 'left' }} >{moment(dataTransaction.deposit.updatedAt).format('DD MMM YYYY')}</Text>
                              <Text style={{ textAlign: 'left' }}>Pembayaran Deposit Telah Diverifikasi Admin</Text>
                            </View>
                          </View>

                          :
                          <View />
                      }
                    </ContainerSection>
                    :
                    <View />
                }
              </View>
              :
              <View />
          }
          {
            collectionContainer ?
              <View style={styles.card}>
                <ContainerSection>
                  {
                    collectionContainer ?
                      <TouchableWithoutFeedback onPress={() => this.setState({ collectionExpanded: !collectionExpanded })}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <Text style={{ flex: 1, fontSize: 20 }}>Pengumpulan</Text>
                          <View style={{ flex: 1 }}>
                            <Icon size={30} style={{ alignSelf: 'flex-end' }} name={collectionExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                      :
                      <View />
                  }
                </ContainerSection>
                {
                  collectionExpanded ?
                    <ContainerSection>
                      <View style={{ flexDirection: 'column', flex: 1 }}>
                        {
                          collectionNotYet ?
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                              <View style={{ flex: 1 }}>
                                <Text style={{ textAlign: 'left' }}> Nelayan belum melakukan upload foto pengumpulan.</Text>
                                <Text style={{ textAlign: 'left' }}> Silahkan lakukan diskusi/chat untuk mempercepat transaksi.</Text>
                              </View>
                            </View>
                            :
                            <View />
                        }
                        {
                          collectionPending ?
                            <View>
                              <Text>Nelayan sudah melakukan upload foto pengumupulan, sedang diverifikasi oleh admin</Text>
                            </View>
                            :
                            <View />
                        }
                        {
                          collectionApproved ?
                            <View>
                              <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/images/${dataTransaction.collection.photo}`).catch(err => console.error('An error occurred', err))}>
                                <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                  <Image
                                    style={{ height: 200, width: 500, margin: 3, alignSelf: 'stretch', resizeMode: 'cover' }}
                                    source={{ uri: `${BASE_URL}/images/${dataTransaction.collection.photo}` }}
                                  />
                                </View>
                              </TouchableOpacity>
                            </View>
                            :
                            <View />
                        }
                        {
                          collectionRejected ?
                            <View>
                              <Text>Foto Nelayang di rejected oleh admin. </Text>
                              <Text>Silahkan tunggu nelayan untuk proses upload ulang</Text>
                            </View>
                            :
                            <View />
                        }
                      </View>
                    </ContainerSection>
                    :
                    <View />
                }
              </View>
              :
              <View />
          }
          {
            productionContainer ?
              <View style={styles.card}>
                <ContainerSection>
                  {
                    productionContainer ?
                      <TouchableWithoutFeedback onPress={() => this.setState({ productionExpanded: !productionExpanded })}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <Text style={{ flex: 1, fontSize: 20 }}>Produksi</Text>
                          <View style={{ flex: 1 }}>
                            <Icon size={30} style={{ alignSelf: 'flex-end' }} name={productionExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                      :
                      <View />
                  }
                </ContainerSection>
                {
                  productionExpanded ?
                    <ContainerSection>
                      <View style={{ flexDirection: 'column', flex: 1 }}>
                        {
                          productionNotYet ?
                            <View>
                              <Text> Nelayan belum melakukan upload foto produksi </Text>
                            </View>
                            :
                            <View />
                        }
                        {
                          productionPending ?
                            <View>
                              <Text>Nelayan sudah melakukan upload foto produksi, sedang diverifikasi oleh admin</Text>
                            </View>
                            :
                            <View />
                        }
                        {
                          productionApproved ?
                            <View>
                              <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/images/${dataTransaction.production.photo}`).catch(err => console.error('An error occurred', err))}>
                                <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                  <Image
                                    style={{ height: 200, width: 500, margin: 3, alignSelf: 'stretch', resizeMode: 'cover' }}
                                    source={{ uri: `${BASE_URL}/images/${dataTransaction.production.photo}` }}
                                  />
                                </View>
                              </TouchableOpacity>
                            </View>
                            :
                            <View />
                        }
                        {
                          productionRejected ?
                            <View>
                              <Text>Foto Nelayang di rejected oleh admin. </Text>
                              <Text>Silahkan tunggu nelayan untuk proses upload ulang</Text>
                            </View>
                            :
                            <View />
                        }
                      </View>
                    </ContainerSection>
                    :
                    <View />
                }
              </View>
              :
              <View />
          }
          {
            shippingContainer ?
              <View style={styles.card}>
                <ContainerSection>
                  {
                    shippingContainer ?
                      <TouchableWithoutFeedback onPress={() => this.setState({ shippingExpanded: !shippingExpanded })}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <Text style={{ flex: 1, fontSize: 20 }}>Pengiriman</Text>
                          <View style={{ flex: 1 }}>
                            <Icon size={30} style={{ alignSelf: 'flex-end' }} name={shippingExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                      :
                      <View />
                  }
                </ContainerSection>
                {
                  shippingExpanded ?
                    <ContainerSection>
                      {
                        shippingNotYet ?
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ textAlign: 'left' }}> Nelayan belum melakukan upload foto pengumpulan.</Text>
                              <Text style={{ textAlign: 'left' }}> Silahkan lakukan diskusi/chat untuk mempercepat transaksi.</Text>
                            </View>
                          </View>
                          :
                          <View />
                      }
                      {
                        shippingPending ?
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ textAlign: 'left' }}> Nelayan telah melakukan upload foto pengiriman.</Text>
                              <Text style={{ textAlign: 'left' }}> Silahkan tunggu verifikasi admin.</Text>
                              <Text style={{ textAlign: 'left' }}> Silahkan lakukan diskusi/chat untuk mempercepat transaksi.</Text>
                            </View>
                          </View>
                          :
                          <View />
                      }
                      {
                        shippingApproved ?
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/images/${dataTransaction.shipping.photo}`).catch(err => console.error('An error occurred', err))}>
                              <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                <Image
                                  style={{ height: 200, width: 500, margin: 3, alignSelf: 'stretch', resizeMode: 'cover' }}
                                  source={{ uri: `${BASE_URL}/images/${dataTransaction.shipping.photo}` }}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                          :
                          <View />
                      }
                      {
                        shippingRevision ?
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ textAlign: 'left' }}> Foto pengiriman sedang dilakukan revisi oleh Nelayan</Text>
                              <Text style={{ textAlign: 'left' }}> Silahkan tunggu.</Text>
                              <Text style={{ textAlign: 'left' }}> Silahkan lakukan diskusi/chat untuk mempercepat transaksi.</Text>
                            </View>
                          </View>
                          :
                          <View />
                      }
                    </ContainerSection>
                    :
                    <View />
                }
              </View>
              :
              <View />
          }
          {
            deliveryContainer ?
              <View style={styles.card}>
                <ContainerSection>
                  {
                    deliveryContainer ?
                      <TouchableWithoutFeedback onPress={() => this.setState({ deliveryExpanded: !deliveryExpanded })}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <Text style={{ flex: 1, fontSize: 20 }}>Penerimaan</Text>
                          <View style={{ flex: 1 }}>
                            <Icon size={30} style={{ alignSelf: 'flex-end' }} name={deliveryExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                      :
                      <View />
                  }
                </ContainerSection>
                {
                  deliveryExpanded ?
                    <ContainerSection>
                      {
                        deliveryNotYet ?
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ textAlign: 'center' }}> Silahkan lakukan upload bukti penerimaan barang jika sudah diterima.</Text>
                              {
                                loader ?
                                  <View>
                                    <Spinner size='large' />
                                  </View>
                                  :
                                  <View style={{ marginTop: 20 }}>
                                    <Button onPress={() => { this.uploadReceiving() }}>
                                      Unggah Bukti Penerimaan
                                    </Button>
                                  </View>
                              }
                            </View>
                          </View>
                          :
                          <View />
                      }
                      {
                        deliveryPending ?
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ textAlign: 'left' }}> Anda telah melakukan upload foto bukti penerimaan.</Text>
                              <Text style={{ textAlign: 'left' }}> Silahkan tunggu verifikasi admin.</Text>
                              <Text style={{ textAlign: 'left' }}> Silahkan lakukan diskusi/chat untuk mempercepat transaksi.</Text>
                            </View>
                          </View>
                          :
                          <View />
                      }
                      {
                        deliveryApproved ?
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/images/${dataTransaction.shippingDelivered.photo}`).catch(err => console.error('An error occurred', err))}>
                              <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                <Image
                                  style={{ height: 200, width: 500, margin: 3, alignSelf: 'stretch', resizeMode: 'cover' }}
                                  source={{ uri: `${BASE_URL}/images/${dataTransaction.shippingDelivered.photo}` }}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                          :
                          <View />
                      }
                      {
                        deliveryRevision ?
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ textAlign: 'left' }}> Foto bukti penerimaan anda telah direvisi admin</Text>
                              <Text style={{ textAlign: 'left' }}> Silahkan upload ulang foto bukti penerimaan barang anda.</Text>
                              {
                                loader ?
                                  <View>
                                    <Spinner size='large' />
                                  </View>
                                  :
                                  <View style={{ marginTop: 20 }}>
                                    <Button onPress={() => { this.uploadReceivingRevision() }}>
                                      Unggah Bukti Penerimaan
                                    </Button>
                                  </View>
                              }
                            </View>
                          </View>
                          :
                          <View />
                      }
                    </ContainerSection>
                    :
                    <View />
                }
              </View>
              :
              <View />
          }
          {
            doneContainer ?
              <View style={styles.card}>
                <ContainerSection>
                  {
                    doneContainer ?
                      <TouchableWithoutFeedback onPress={() => this.setState({ doneExpanded: !doneExpanded })}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <Text style={{ fontSize: 20 }}>Review & Rating</Text>
                          <View style={{ flex: 1 }}>
                            <Icon size={30} style={{ alignSelf: 'flex-end' }} name={doneExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                      :
                      <View />
                  }
                </ContainerSection>
                {
                  doneExpanded ?
                    <ContainerSection>
                      {
                        dataTransaction.Review ?
                          <View style={{ marginBottom: 30 }}>
                            <Text>Transaksi Selesai.</Text>
                            <Text>Anda sudah me-review nelayan. terimakasih</Text>
                          </View>
                          :
                          <View style={{ flexDirection: 'column', flex: 1 }}>
                            <View style={{ alignItems: 'center', flex: 1, marginBottom: 20 }}>
                              <Rating
                                imageSize={20}
                                startingValue={3.5}
                              />
                            </View>
                            <Input
                              placeholder='Komentar'
                              value={reviewKomentar}
                              onChangeText={v => this.onChangeInput('reviewKomentar', v)}
                              multiline
                              lines={5}
                              textAlignVertical="top"
                            />

                            {
                              loader ?
                                <View>
                                  <Spinner size='large' />
                                </View>
                                :
                                <View style={{ marginTop: 20 }}>
                                  <Button onPress={() => { this.giveComment() }}>
                                    Beri Ulasan
                                  </Button>
                                </View>
                            }
                          </View>
                      }
                    </ContainerSection>
                    :
                    <View />
                }
              </View>
              :
              <View />
          }
        </Card>
      </ScrollView>
    )
  }
}

const styles = {
  card: {
    borderTopWidth: 1,
    borderColor: '#eaeaea',
    padding: 5
  },
  thumbnailStyle: {
    height: 100,
    width: 100,
    borderRadius: 2
  },
  buyerName: {
    fontSize: 20
  },
  statusText: {
    fontSize: 20,
  },
  statusTextActive: {
    fontSize: 20,
    color: COLOR.secondary_a
  }
}

export default DetailTransactionPage;
